/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import Repositories from './containers/gits/Repositories';
import Repository from './containers/gits/Repository';
import AddRepository from './containers/gits/AddRepository';
import Menu from './containers/Menu';

export default () => (
  <App>
    <div className="pane-group">
      <div className="pane-sm sidebar">
        <Menu />
      </div>
      <div className="pane">
        <Switch>
          <Route path="/counter" component={CounterPage} />
          <Route path="/gits/create" component={AddRepository} />
          <Route path="/gits/repositories/:projectName" component={Repository} />
          <Route path="/gits/repositories" component={Repositories} />
          <Route path="/" component={HomePage} />
        </Switch>
      </div>
    </div>
  </App>
);
