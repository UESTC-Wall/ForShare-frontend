import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App';
import createSourceShareList from './pages/SourceShareList';
import SourceShare from './pages/SourceShare';
import WriteSourceLink from './pages/WriteSourceLink';
import WriteArticle from './pages/WriteArticle';
import UserInterface from './pages/UserInterface';
import UserCreate from './pages/UserCreate';

const SourceShareList = createSourceShareList("link");

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={SourceShareList} />
    <Route path="link/:id" component={SourceShare("link")} />
    <Route path="article/:id" component={SourceShare("article")} />
    <Route path="articlesourcelist" component={createSourceShareList("article")} />
    <Route path="linksourcelist" component={createSourceShareList("link")} />
    <Route path="newlink" component={WriteSourceLink} />
    <Route path="newarticle" component={WriteArticle} />
    <Route path="user/:id" component={UserInterface} />
    <Route path="newuser" component={UserCreate} />
  </Route>
);

export default routes;
