// @flow

import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';
import getSettings from './storage/settings';
import gits from './actions/gits';
import setts from './actions/settings';

const settings = getSettings();

const store = configureStore();
const dispatch = store.dispatch.bind(store);
// gits.Actors.addProject(
//   'gitviam:activeviam/activepivot',
//   'ActivePivot',
//   [
//     '/home/olivier/projects/qfs/views/ap5.6/workspace/unity',
//     '/home/olivier/projects/qfs/views/ap5.5/workspace/unity',
//     '/home/olivier/projects/qfs/views/ap5.4/workspace/unity'
//   ]
// )(dispatch);

const savedCredentials = settings.getCredentials();
if (savedCredentials !== null) {
  setts.Actors.setToken(savedCredentials.username, savedCredentials.token)(dispatch);
}

settings.getProjects()
  .map(project => gits.Actors.addProject(project.gitUrl, project.name, project.locations, savedCredentials))
  .map(thunk => thunk(dispatch));

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
