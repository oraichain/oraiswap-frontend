import * as bitcoin from 'bitcoinjs-lib';

export const convertScriptPubkeyToBtcAddress = (scriptPubkey: String): String => {
  const scriptPubKeyBuffer = Buffer.from(scriptPubkey, 'hex');
  const address = bitcoin.address.fromOutputScript(scriptPubKeyBuffer);
  return address;
};
