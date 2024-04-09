/* eslint-disable import/no-anonymous-default-export */
import Loader from 'components/Loader';
import NotFound from 'pages/NotFound';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Balance from 'pages/Balance';
import Pools from 'pages/Pools';
import PoolDetail from 'pages/Pools/PoolDetail';
import UniversalSwap from 'pages/UniversalSwap';
import CoHarvest from 'pages/CoHarvest';
import BitcoinDashboard from 'pages/BitcoinDashboard';
import StakingPage from 'pages/Staking';
import DownloadApp from 'pages/DownloadApp';
import { Vaults } from 'pages/Vaults';
import { VaultDetail } from 'pages/VaultDetail';

export default () => (
  <Suspense
    fallback={
      <div
        style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Loader />
      </div>
    }
  >
    <Routes>
      <Route path="/" element={<UniversalSwap />} />
      <Route path="/bridge" element={<Balance />} />
      <Route path="/bitcoin-dashboard" element={<BitcoinDashboard />} />
      <Route path="/universalswap" element={<UniversalSwap />} />
      <Route path="/pools" element={<Pools />} />
      <Route path="/staking" element={<StakingPage />} />
      <Route path="/co-harvest" element={<CoHarvest />} />
      <Route path="/vaults" element={<Vaults />} />
      <Route path="/vaults/:vaultUrl" element={<VaultDetail />} />
      <Route path="/download-owallet" element={<DownloadApp />} />
      <Route path="/pools/:poolUrl" element={<PoolDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);
