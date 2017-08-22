// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import type { CounterStateType } from './counter';
import type { GitStateType } from './gits';
import type { SettingsStateType } from './settings';

import counter from './counter';
import gits from './gits';
import settings from './settings';

export type StateType = {
  counter: CounterStateType,
  repositories: GitStateType,
  settings: SettingsStateType
};

const rootReducer = combineReducers({
  counter,
  router,
  settings,
  repositories: gits
});

export default rootReducer;
