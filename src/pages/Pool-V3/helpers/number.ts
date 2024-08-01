export const convertBalanceToBigint = (amount: string, decimals: bigint | number): bigint => {
  if (!amount) {
    return 0n;
  }
  const balanceString = amount.toString().split('.');
  if (balanceString.length !== 2) {
    return BigInt(balanceString[0] + '0'.repeat(Number(decimals)));
  }

  if (balanceString[1].length <= decimals) {
    return BigInt(balanceString[0] + balanceString[1] + '0'.repeat(Number(decimals) - balanceString[1].length));
  }
  return 0n;
};
