/* eslint-disable import/no-anonymous-default-export */
import Loader from 'components/Loader';
import NotFound from 'pages/NotFound';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import Balance from 'pages/Balance';
import Pools from 'pages/Pools/indexV3';
import PoolDetail from 'pages/Pools/PoolDetailV3';
import SwapV2 from 'pages/SwapV2/index';
import UniversalSwap from 'pages/UniversalSwap/index';

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
      <Route path="/" element={<Balance />} />
      <Route path="/swap" element={<SwapV2 />} />
      <Route path="/universalswap" element={<UniversalSwap />} />
      <Route path="/pools" element={<Pools />} />
      <Route path="/bridge" element={<Balance />} />
      <Route path="/pool/:poolUrl" element={<PoolDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);
