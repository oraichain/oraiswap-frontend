/* eslint-disable import/no-anonymous-default-export */
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import NotFound from 'pages/NotFound';
import AirDrop from 'pages/AirDrop';
import EthereumTest from 'pages/EthereumTest';
import Loader from 'components/Loader';

const SwapV2 = React.lazy(() => import('pages/SwapV2/index'));
const Pools = React.lazy(() => import('pages/Pools'));
const BalanceNew = React.lazy(() => import('pages/BalanceNew'));
const PoolDetail = React.lazy(() => import('pages/Pools/PoolDetail'));
// const Maintenance = React.lazy(() => import('pages/Maintenance'));

export default () => {
  return (
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
        <Route path="/swap" element={<SwapV2 />} />
        <Route path="/pools" element={<Pools />} />
        <Route path="/airdrop/:chain" element={<AirDrop />} />
        <Route path="/ethereum" element={<EthereumTest />} />
        <Route path="/bridge" element={<BalanceNew />} />
        <Route path="/pool/:poolUrl" element={<PoolDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
