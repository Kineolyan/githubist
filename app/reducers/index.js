// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import gits from './gits'
import type { CounterStateType } from './counter';
import type { GitStateType } from './gits';

export type StateType = {
  counter: CounterStateType,
  repositories: GitStateType
};

const rootReducer = combineReducers({
  counter,
  router,
});

export default rootReducer;
