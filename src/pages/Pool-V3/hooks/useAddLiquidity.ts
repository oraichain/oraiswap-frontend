import SingletonOraiswapV3 from 'libs/contractSingleton';
import {
  approveListToken,
  calculateTokenAmountsWithSlippage,
  createPoolTx,
  createPositionTx,
  createPositionWithNativeTx,
  genMsgAllowance,
  InitPositionData,
  isNativeToken
} from '../helpers/helper';

import { newPoolKey } from '@oraichain/oraiswap-v3';
import { getCosmWasmClient } from 'libs/cosmjs';
import { network } from 'config/networks';

const useAddLiquidity = () => {
  const handleInitPositionWithNative = async (data: InitPositionData, walletAddress: string, onSuccess, onError) => {
    const { poolKeyData, lowerTick, upperTick, spotSqrtPrice, liquidityDelta, initPool, slippageTolerance } = data;

    const { token_x, token_y, fee_tier } = poolKeyData;

    try {
      const [xAmountWithSlippage, yAmountWithSlippage] = calculateTokenAmountsWithSlippage(
        fee_tier.tick_spacing,
        spotSqrtPrice,
        liquidityDelta,
        lowerTick,
        upperTick,
        Number(slippageTolerance),
        true
      );

      let listTokenApprove = [];
      if (!isNativeToken(token_x)) listTokenApprove.push(token_x);
      if (!isNativeToken(token_y)) listTokenApprove.push(token_y);
      if (listTokenApprove.length > 0) {
        const msg = genMsgAllowance(listTokenApprove);
        await approveListToken(msg, walletAddress);
      }

      const poolKey = newPoolKey(token_x, token_y, fee_tier);

      if (initPool) {
        await createPoolTx(poolKey, spotSqrtPrice.toString(), walletAddress);
      }

      // TODO:here
      const tx = await createPositionWithNativeTx(
        poolKey,
        lowerTick,
        upperTick,
        liquidityDelta,
        spotSqrtPrice,
        slippageTolerance,
        xAmountWithSlippage,
        yAmountWithSlippage,
        walletAddress
      );
      if (tx) {
        onSuccess(tx);
      }
      return tx;
    } catch (e: any) {
      console.log('error', e);
      onError(e);
    }
  };

  const handleInitPosition = async (data: InitPositionData, walletAddress: string, onSuccess, onError) => {
    const { client } = await getCosmWasmClient({ chainId: network.chainId });
    await SingletonOraiswapV3.load(client, walletAddress);

    const {
      poolKeyData,
      lowerTick,
      upperTick,
      spotSqrtPrice,
      tokenXAmount,
      tokenYAmount,
      liquidityDelta,
      initPool,
      slippageTolerance
    } = data;

    const { token_x, token_y, fee_tier } = poolKeyData;

    if (
      // TODO: open to ibc tokens later
      (isNativeToken(token_x) && tokenXAmount !== 0n) ||
      (isNativeToken(token_y) && tokenYAmount !== 0n)
    ) {
      return await handleInitPositionWithNative(data, walletAddress, onSuccess, onError);
    }

    try {
      const txs = [];

      const [xAmountWithSlippage, yAmountWithSlippage] = calculateTokenAmountsWithSlippage(
        fee_tier.tick_spacing,
        spotSqrtPrice,
        liquidityDelta,
        lowerTick,
        upperTick,
        Number(slippageTolerance),
        true
      );

      let listTokenApprove = [];
      if (!isNativeToken(token_x)) listTokenApprove.push(token_x);
      if (!isNativeToken(token_y)) listTokenApprove.push(token_y);

      const msg = genMsgAllowance(listTokenApprove);

      await approveListToken(msg, walletAddress);

      const poolKey = newPoolKey(token_x, token_y, fee_tier);

      if (initPool) {
        const createTx = await createPoolTx(poolKey, spotSqrtPrice.toString(), walletAddress);
        txs.push(createTx);
      }

      const tx = await createPositionTx(
        poolKey,
        lowerTick,
        upperTick,
        liquidityDelta,
        spotSqrtPrice,
        slippageTolerance,
        walletAddress
      );
      txs.push(tx);
      if (tx) {
        onSuccess(tx);
      }
      return tx;
    } catch (e: any) {
      console.log(e);
      onError(e);
    }
  };

  return {
    handleInitPositionWithNative,
    handleInitPosition
  };
};

export default useAddLiquidity;
