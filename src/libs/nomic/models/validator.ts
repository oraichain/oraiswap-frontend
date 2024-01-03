import { ValidatorInfo } from './validator-info';
import { delay, partitionFilter, sanitizeUrl } from '../utils';
// import { makeAutoObservable } from 'mobx';
import { OraiBtc } from '@oraichain/oraibtc-wasm';

export interface ValidatorModel {
  info: ValidatorInfo;
  address: string;
  votingPower: bigint;
  commission: number;
  isJailed: boolean;
  isActive: boolean;
  logo?: string;
}

export class Validator implements ValidatorModel {
  info: ValidatorInfo;
  address: string;
  votingPower: bigint;
  commission: number;
  isJailed: boolean;
  isActive: boolean;
  logo: string | null;

  constructor(validator: ValidatorModel) {
    this.info = validator.info;
    this.address = validator.address;
    this.votingPower = validator.votingPower;
    this.commission = validator.commission;
    this.isJailed = validator.isJailed;
    this.isActive = validator.isActive;
    this.logo = validator.logo;

    // makeAutoObservable(this);
  }
}

function getCachedLogo(address: string) {
  return localStorage.getItem('nomic/validator/logo/' + address);
}

async function setLogos(vals: Validator[], chunkSize = 10) {
  const [, loadableVals] = partitionFilter(vals, (val) => {
    let cachedLogo = getCachedLogo(val.address);
    if (cachedLogo) {
      if (cachedLogo.includes('"')) {
        cachedLogo = cachedLogo.replace(/"/g, '');
        localStorage.setItem('nomic/validator/logo/' + val.address, cachedLogo);
      }
      val.logo = cachedLogo;
    }
    return !!cachedLogo;
  });

  const chunks: Validator[][] = [loadableVals];

  while (loadableVals.length > 0) {
    const chunk = loadableVals.splice(0, chunkSize);
    chunks.push(chunk);
  }

  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(async (val) => {
        const logo = await fetchLogo(val.info.identity);
        if (logo) {
          localStorage.setItem('nomic/validator/logo/' + val.address, JSON.stringify(logo).replace(/"/g, ''));
        }
        val.logo = logo;
      })
    );
    await delay(500);
  }
}

export async function getAllValidators(nomic: OraiBtc): Promise<Validator[]> {
  const validators = (await nomic.allValidators())
    .map((rawVal) => {
      try {
        const info: ValidatorInfo = JSON.parse(rawVal.info);
        info.website = sanitizeUrl(info.website);
        const validator: ValidatorModel = {
          ...rawVal,
          info: info,
          address: rawVal.address,
          commission: parseFloat(rawVal.commission),
          isActive: rawVal.inActiveSet,
          isJailed: rawVal.jailed,
          votingPower: rawVal.amountStaked
        };
        return new Validator(validator);
      } catch (e) {
        return null;
      }
    })
    .filter((val) => !!val);

  validators.sort((a, b) => Number(b.votingPower) - Number(a.votingPower));
  setLogos(validators);
  return validators;
}

export async function fetchLogo(identity: string): Promise<string | undefined> {
  if (identity.length != 16) {
    return;
  }
  try {
    const res = await fetch(
      'https://keybase.io/_/api/1.0/user/lookup.json?' +
        new URLSearchParams({
          fields: 'pictures',
          key_suffix: identity
        }),
      {
        mode: 'cors'
      }
    ).then((response) =>
      response.json().then((json) => {
        return json;
      })
    );
    if (res.them && res.them.length > 0) {
      try {
        return res.them[0].pictures.primary.url;
      } catch (e) {
        return;
      }
    }
  } catch (e) {
    return;
  }
}
