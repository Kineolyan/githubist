// @flow
import type { Branch } from '../services/git';
import type { PullRequest } from '../services/github';

import { nameActions } from '../utils/actions';
import * as git from '../services/git';
import * as github from '../services/github';

const Actions = {
  SET_GITHUB_TOKEN: '',
  SAVE_GITHUB_TOKEN: ''
};
nameActions(Actions, 'SETTINGS');

type SetGithubToken = {
  type: string,
  username: string,
  token: string
};

type SetTokenStatus = {
  type: string,
  username: string,
  status: boolean
};

type SaveGithubToken = {
  type: string,
  username: string
};

function checkToken(username: string, token: string, dispatch: (any) => void): void {

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

function saveToken(username: string) {
  return (dispatch: (action: SaveGithubToken) => void) => {
    const action: SaveGithubToken = {
      type: Actions.SAVE_GITHUB_TOKEN,
      username
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
 SetGithubToken,
 SetTokenStatus,
 SaveGithubToken
};
