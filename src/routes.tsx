import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Swap from './pages/Swap';
import PoolsPage from './pages/pools';

export default () => (
  <Switch>
    <Route exact path="/" component={Swap} />
    <Route exact path="/pools" component={PoolsPage} />

    <Redirect to="/" />
  </Switch>
);
