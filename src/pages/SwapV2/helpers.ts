/**
 * This function check if the slippage of the trade is greater than the slippage set by the user
 * @param fromAmountToken - average ratio token in and token out
 * @param averageRatio - average ratio token in and token out
 * @param toAmountToken - token out after simulate
 * @param userSlippage - slippage user config
 * @returns is slippage greater than userSlippage
 */
export const checkSlippage = (
  fromAmountToken: number,
  averageRatio: string,
  actualReceived: number,
  userSlippage: number
): boolean => {
  const expectedToken = fromAmountToken * Number(averageRatio);
  const slippage = (1 - actualReceived / expectedToken) * 100;
  return slippage > userSlippage;
};
