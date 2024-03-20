import { RefObject } from 'react';
// import { NextRouter } from 'next/router';

export const classJoin = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const toRoundedString = (num: bigint | number, places: number, locale = false): string => {
  const multiplier = Math.pow(10, places);
  const res = Math.floor(Number(num) * multiplier) / multiplier;
  let resStr = Number(res).toFixed(places);
  if (locale) {
    resStr = resStr.toLocaleString();
  }
  return resStr.replace(/\.?0+$/, '');
};

export const displayNom = (amount: bigint, displayDenom = false): string => {
  return toRoundedString(Number(amount) / 1e6, 6, true) + (displayDenom ? ' oraibtc' : '');
};

export const displayBtc = (amount: bigint, displayDenom = true): string => {
  return toRoundedString(Number(amount) / 1e14, 8, true) + (displayDenom ? ' BTC' : '');
};

export const displayUsd = (amount: number): string => {
  const formatter = Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD'
  });
  return formatter.format(amount);
};

export const displayPercentage = (amount: number): string => {
  return toRoundedString(amount * 100, 2, true) + '%';
};

// export const updateUrlQueryParams = (router: NextRouter, ...fields: { key: string; value: string }[]) => {
//   const { pathname, query } = router;
//   fields.forEach((field) => (router.query[field.key] = field.value));
//   router.push({ pathname, query }, undefined, { shallow: true, scroll: false });
// };

// export const removeUrlQueryParams = (router: NextRouter, ...keys: string[]) => {
//   const { pathname, query } = router;
//   keys.forEach((key) => delete router.query[key]);
//   router.replace({ pathname, query }, undefined, { shallow: true, scroll: false });
// };

// export const getUrlQueryParam = (router: NextRouter, key: string) => {
//   const param = router.query[key];
//   if (!isString(param)) {
//     return;
//   }
//   return param as string;
// };

function isString(param: string | string[] | undefined): param is string {
  return (param as string) !== undefined;
}

export const sanitizeUrl = (url: string) => {
  const invalidProtocolRegex = /^(%20|\s)*(javascript|data|vbscript)/im;
  const ctrlCharactersRegex = /[^\x20-\x7EÀ-ž]/gim;
  const urlSchemeRegex = /^([^:]+):/gm;
  const relativeFirstCharacters = ['.', '/'];

  const sanitizedUrl = url.replace(ctrlCharactersRegex, '').trim();
  if (relativeFirstCharacters.indexOf(sanitizedUrl[0]) > -1) {
    return sanitizedUrl;
  }

  const urlSchemeParseResults = sanitizedUrl.match(urlSchemeRegex);
  if (!urlSchemeParseResults) {
    return sanitizedUrl;
  }

  const urlScheme = urlSchemeParseResults[0];
  if (invalidProtocolRegex.test(urlScheme)) {
    return '';
  }

  return sanitizedUrl;
};

export const containContent = (contentRef: RefObject<HTMLDivElement>, children: RefObject<HTMLDivElement>[]) => {
  if (contentRef.current) {
    const contentHeight = contentRef.current.offsetHeight;
    children.forEach((ref) => {
      if (ref.current) {
        ref.current.style.height = contentHeight + 'px';
      }
    });
  }
};

export const partitionFilter = <T>(array: T[], isValid: (e: T) => boolean): [T[], T[]] => {
  return array.reduce(
    ([pass, fail]: [T[], T[]], element: T) => {
      return isValid(element) ? ([[...pass, element], fail] as [T[], T[]]) : ([pass, [...fail, element]] as [T[], T[]]);
    },
    [[], []]
  );
};
