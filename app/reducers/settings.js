// @flow
import type {
  ActionTypes,
  SetGithubToken,
  SetTokenStatus,
} from '../actions/settings';

import settingActions from '../actions/settings';
import getSettings from '../storage/settings';

const settings = getSettings();

const { Actions } = settingActions;

type SettingsStateType = {
  username: string,
  token: string,
  tokenValidity: boolean | null,
  saved: boolean
};

function setToken(state: SettingsStateType, action: SetGithubToken): SettingsStateType {
  return {
    username: action.username,
    token: action.token,
    tokenValidity: null,
    saved: action.username !== state.username && action.token !== state.token
  };
}

function validateToken(state: SettingsStateType, action: SetTokenStatus) {
  return {
    ...state,
    tokenValidity: action.status
  };
}

function saveToken(state: SettingsStateType): SettingsStateType {
  if (state.saved) {
    return state;
  }

  settings.saveCredentials(state.username, state.token);

  return {
    ...state,
    saved: true
  };
}

const INITIAL_STATE: SettingsStateType = {
  username: '',
  token: '',
  tokenValidity: false,
  saved: false
};
export default function reducer(state: SettingsStateType = INITIAL_STATE, action: ActionTypes | {type: string}): SettingsStateType {
  switch (action.type) {
    case Actions.SET_GITHUB_TOKEN:
      return setToken(state, ((action: any): SetGithubToken));
    case Actions.SAVE_GITHUB_TOKEN:
      return saveToken(state);
    case Actions.VALIDATE_GITHUB_TOKEN:
      return validateToken(state, ((action: any): SetTokenStatus));
    default:
      return state;
  }
}

export type {
  SettingsStateType
};
