// @flow
import type { Branch } from '../services/git';
import type { PullRequest } from '../services/github';

import { nameActions } from '../utils/actions';
import * as git from '../services/git';
import * as github from '../services/github';

const Actions = {
  SET_GITHUB_TOKEN: '',
  SAVE_GITHUB_TOKEN: '',
  VALIDATE_GITHUB_TOKEN: ''
};
nameActions(Actions, 'SETTINGS');

type SetGithubToken = {
  type: string,
  username: string,
  token: string
};

type SetTokenStatus = {
  type: string,
  status: boolean
};

type SaveGithubToken = {
  type: string
};

type ActionTypes = SetGithubToken
  | SetTokenStatus
  | SaveGithubToken;

function checkToken(username: string, token: string, dispatch: (any) => void): void {
  const sendAction = status => {
    const action: SetTokenStatus = {
      type: Actions.VALIDATE_GITHUB_TOKEN,
      status
    };
    dispatch(action);
  };

  github.checkToken(token)
    .then(sendAction)
    .catch(() => sendAction(false));
}

function setToken(username: string, token: string) {
  return (dispatch: (action: SetGithubToken) => void) => {
    const action: SetGithubToken = {
      type: Actions.SET_GITHUB_TOKEN,
      username,
      token
    };
    dispatch(action);

    checkToken(username, token, dispatch);
  };
}

function saveToken() {
  return (dispatch: (action: SaveGithubToken) => void) => {
    const action: SaveGithubToken = {
      type: Actions.SAVE_GITHUB_TOKEN
    };
    dispatch(action);
  };
}

export default {
  Actions,
  Actors: {
    setToken,
    saveToken
  }
};

export type {
  ActionTypes,
  SetGithubToken,
  SetTokenStatus,
  SaveGithubToken
};
