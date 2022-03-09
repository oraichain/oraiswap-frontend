import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Swap from './pages/Swap';
import PoolsPage from './pages/pools';
import AssetsPage from './pages/assets';
export default () => (
  <Switch>
    <Route exact path="/" component={Swap} />
    <Route exact path="/pools" component={PoolsPage} />
    <Route exact path="/assets" component={AssetsPage} />
    <Redirect to="/" />
  </Switch>
);
