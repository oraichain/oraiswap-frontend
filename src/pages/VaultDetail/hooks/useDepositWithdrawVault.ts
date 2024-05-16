import { fromBech32, toBech32 } from '@cosmjs/encoding';
import { Cw20BaseClient } from '@oraichain/common-contracts-sdk';
import { ORAI_BRIDGE_EVM_DENOM_PREFIX, USDT_CONTRACT } from '@oraichain/oraidex-common';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import { network } from 'config/networks';
import { handleErrorTransaction } from 'helper';
import { VaultLP__factory } from 'nestquant-vault-sdk';
import { DepositOrderMsg } from 'nestquant-vault-sdk/dist/wasm-ts/OraiGateway.types';
import { ORAI_VAULT_BSC_CONTRACT_ADDRESS } from 'pages/Vaults/constants';
import { VaultClients } from 'pages/Vaults/helpers/vault-query';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// TODO: current hardcode channel id
export const BSC_CHANNEL_ID = 'channel-29';
export const NETWORK = 'bsc';

interface DepositState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  deposit: (payload: {
    userAddr: string;
    evmDenom: string;
    amount: bigint;
    vaultAddr: string;
    networkDeposit: string;
  }) => Promise<void>;
  withdraw: (payload: {
    userAddr: string;
    amount: bigint;
    vaultAddr: string;
    networkWithdraw: string;
  }) => Promise<void>;
}

export const useDepositWithdrawVault = create<DepositState>()(
  devtools(
    (set) => ({
      loading: false,
      setLoading: (loading) => set(() => ({ loading })),
      deposit: async ({ userAddr, evmDenom, amount, vaultAddr, networkDeposit }) => {
        if (!userAddr) throw new Error('Cannot get user address');
        if (!amount) throw new Error('Amount is invalid');
        if (!vaultAddr) throw new Error('Vault address is not defined');
        if (!networkDeposit) throw new Error('network is not defined');

        set({ loading: true });
        displayToast(TToastType.TX_BROADCASTING);
        try {
          const gatewayClient = VaultClients.getOraiGateway(userAddr);
          const msg: DepositOrderMsg = {
            denom: evmDenom,
            local_channel_id: BSC_CHANNEL_ID,
            vault_address: vaultAddr,
            oraib_address: toBech32(ORAI_BRIDGE_EVM_DENOM_PREFIX, fromBech32(userAddr).data),
            network: networkDeposit
          };

          const cw20Client = new Cw20BaseClient(window.client, userAddr, USDT_CONTRACT);
          const result = await cw20Client.send({
            amount: amount.toString(),
            contract: gatewayClient.contractAddress,
            msg: Buffer.from(JSON.stringify(msg)).toString('base64')
          });

          if (result) {
            displayToast(TToastType.TX_SUCCESSFUL, {
              customLink: `${network.explorer}/txs/${result.transactionHash}`
            });
          }
        } catch (error) {
          console.log('Error deposit vault: ', error);
          handleErrorTransaction(error);
        } finally {
          set({ loading: false });
        }
      },
      withdraw: async ({ userAddr, amount, vaultAddr, networkWithdraw }) => {
        if (!userAddr) throw new Error('Cannot get user address');
        if (!amount) throw new Error('Amount is invalid');
        if (!vaultAddr) throw new Error('Vault address is not defined');

        set({ loading: true });
        displayToast(TToastType.TX_BROADCASTING);
        try {
          const gatewayClient = VaultClients.getOraiGateway(userAddr);

          const isWithdrawing = await gatewayClient.isWithdrawing({
            vaultAddress: vaultAddr,
            withdrawer: userAddr
          });
          if (isWithdrawing) {
            displayToast(TToastType.TX_FAILED, {
              message: 'You are withdrawing, please wait for the previous transaction to complete'
            });

            return;
          }

          const totalSupply = await gatewayClient.totalSupply({ vaultAddress: vaultAddr });
          const balanceOfUser = await gatewayClient.balance({ vaultAddress: vaultAddr, userAddress: userAddr });

          let result = null;
          if (BigInt(balanceOfUser.amount) === BigInt(amount)) {
            result = await gatewayClient.withdrawAll({
              vaultAddress: vaultAddr,
              network: networkWithdraw
            });
          } else {
            const vaultLP = VaultLP__factory.connect(vaultAddr, VaultClients.getEthereumProvider());
            const oraiBalance = await vaultLP.balanceOf(ORAI_VAULT_BSC_CONTRACT_ADDRESS);

            if (BigInt(oraiBalance) === 0n) throw new Error('Orai vault balance is zero!');

            const correspondingAmount = (amount * BigInt(totalSupply.total_supply)) / BigInt(oraiBalance);
            result = await gatewayClient.withdraw({
              shareAmount: correspondingAmount.toString(),
              vaultAddress: vaultAddr,
              network: networkWithdraw
            });
          }

          if (result) {
            displayToast(TToastType.TX_SUCCESSFUL, {
              customLink: `${network.explorer}/txs/${result.transactionHash}`
            });
          }
        } catch (error) {
          console.log('Error withdraw vault: ', error);
          handleErrorTransaction(error);
        } finally {
          set({ loading: false });
        }
      }
    }),
    { name: 'useDepositWithdrawVault' }
  )
);
