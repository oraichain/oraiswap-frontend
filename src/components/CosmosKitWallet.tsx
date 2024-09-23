import { useChain, useWallet } from '@cosmos-kit/react';
// import { Card, CardContent, CardHeader, CardTitle } from 'components/card';
// import { ChainWalletCard } from 'components/chain-wallet-card';
import { useEffect } from 'react';
import { Button } from './Button';

// const chainNames_1 = ["cosmoshub"];
// const chainNames_2: string[] = ["cosmoshub"];

// const chainNames_1 = ["osmosis", "cosmoshub"];
// const chainNames_2 = ["stargaze", "chihuahua"];

const chainNames_1 = ['cosmoshub'];
// const chainNames_1 = ["migaloo"];
// const chainNames_2: string[] = ["osmosis"];

// const chainNames_1 = ["coreum"];
const chainNames_2: string[] = [];

export default function IndexPage() {
  const { username, connect, disconnect, wallet, openView } = useChain(chainNames_1[0]);
  const { status: globalStatus, mainWallet } = useWallet(); // status here is the global wallet status for all activated chains (chain is activated when call useChain)

  useEffect(() => {
    const fn = async () => {
      await mainWallet?.connect();
    };
    fn();
  }, []);

  const getGlobalbutton = () => {
    if (globalStatus === 'Connecting') {
      return (
        <Button type="primary-sm" onClick={() => connect()}>
          {`Connecting ${wallet?.prettyName}`}
        </Button>
      );
    }
    if (globalStatus === 'Connected') {
      return (
        <>
          <Button type="primary-sm" onClick={() => openView()}>
            <div className="flex justify-center items-center space-x-2">
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-green-500 leading-4 mb-2" />
              <span>Connected to: {wallet?.prettyName}</span>
            </div>
          </Button>
          Account name: {username}
          <Button
            type="primary-sm"
            onClick={async () => {
              await disconnect();
              // setGlobalStatus(WalletStatus.Disconnected);
            }}
          >
            Disconnect
          </Button>
        </>
      );
    }

    return (
      <Button type="primary-sm" onClick={() => connect()}>
        Connect Wallet
      </Button>
    );
  };

  return (
    <div className="min-w-[350px] max-w-[800px] mt-20 mx-auto p-10">
      <div>
        <div>
          <p className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">ChainProvider Test</p>
        </div>
      </div>
      <div className="space-y-5">
        <div className="flex justify-start space-x-5">{getGlobalbutton()}</div>

        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Address div in Modal
        </h2>
        {/* {chainNames_1.map((chainName) => (
          <ChainWalletCard key={chainName} type="address-in-modal" chainName={chainName} />
        ))} */}
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Address div on Page
        </h2>
        {/* {chainNames_2.map((chainName) => (
          <ChainWalletCard key={chainName} type="address-on-page" chainName={chainName} />
        ))} */}
      </div>
    </div>
  );
}
