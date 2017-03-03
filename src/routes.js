import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App';
import SourceShareList from './pages/SourceShareList';
import SourceShare from './pages/SourceShare';
import WriteSource from './pages/WriteSource';
import Login from './pages/Login';
import UserInterface from './pages/UserInterface';
import Suggestion from './pages/Suggestion';

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={SourceShareList} />
    <Route path="sourcelist" component={SourceShareList} />
    <Route path="source/:id" component={SourceShare} />
    <Route path="new" component={WriteSource} />
    <Route path="login" component={Login} />
    <Route path="user/:id" component={UserInterface} />
    <Route path="suggestion" component={Suggestion} />
  </Route> 
);

export default routes;