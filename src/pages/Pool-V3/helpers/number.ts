export const convertBalanceToBigint = (amount: string, decimals: bigint | number): bigint => {
  const balanceString = amount.split('.');
  if (balanceString.length !== 2) {
    return BigInt(balanceString[0] + '0'.repeat(Number(decimals)));
  }

  if (balanceString[1].length <= decimals) {
    return BigInt(balanceString[0] + balanceString[1] + '0'.repeat(Number(decimals) - balanceString[1].length));
  }
  return 0n;
};
