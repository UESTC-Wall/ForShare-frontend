import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App';
import SourceShareList from './pages/SourceShareList';
import SourceShare from './pages/SourceShare';
import WriteSourceLink from './pages/WriteSourceLink';
import WriteArticle from './pages/WriteArticle';
import Login from './pages/Login';
import UserInterface from './pages/UserInterface';
import Suggestion from './pages/Suggestion';

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={SourceShareList} />
    <Route path="link" component={SourceShareList} />
    <Route path="article" component={SourceShareList} />
    <Route path="articlesource/:id" component={SourceShare} />
    <Route path="linksource/:id" component={SourceShare} />
    <Route path="newlink" component={WriteSourceLink} />
    <Route path="newarticle" component={WriteArticle} />
    <Route path="login" component={Login} />
    <Route path="user/:id" component={UserInterface} />
    <Route path="suggestion" component={Suggestion} />
  </Route> 
);

export default routes;