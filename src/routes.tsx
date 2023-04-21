/* eslint-disable import/no-anonymous-default-export */
import Loader from 'components/Loader';
import AirDrop from 'pages/AirDrop';
import EthereumTest from 'pages/EthereumTest';
import NotFound from 'pages/NotFound';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import BalanceNew from 'pages/BalanceNew';
// import Pools from 'pages/Pools/index';
import Pools from 'pages/Pools/indexV2';
import PoolDetail from 'pages/Pools/PoolDetail';
import SwapV2 from 'pages/SwapV2/index';
import SwapV3 from 'pages/SwapV3/index';

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
      <Route path="/" element={<BalanceNew />} />
      <Route path="/swapv2" element={<SwapV2 />} />
      <Route path="/swapv3" element={<SwapV3 />} />
      <Route path="/pools" element={<Pools />} />
      <Route path="/airdrop/:chain" element={<AirDrop />} />
      <Route path="/ethereum" element={<EthereumTest />} />
      <Route path="/bridge" element={<BalanceNew />} />
      <Route path="/pool/:poolUrl" element={<PoolDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);
