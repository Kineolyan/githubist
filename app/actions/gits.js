// @flow
import type { Branch } from '../services/git';
import type { PullRequest } from '../services/github';

import { nameActions } from '../utils/actions';
import * as git from '../services/git';
import * as github from '../services/github';

const Actions = {
  ADD_PROJECT: '',
  EDIT_PROJECT: '',
  DELETE_PROJECT: '',
  LOAD_BRANCHES: '',
  STORE_BRANCHES: '',
  CANNOT_LOAD_BRANCHES: '',
  STORE_PULL_REQUESTS: '',
  CANNOT_LOAD_REQUESTS: ''
};
nameActions(Actions, 'GIT');

type ProjectErrorActionType = {
  type: string,
  gitUrl: string,
  error: Error
};
type AddProjectActionType = {
  type: string,
  gitUrl: string,
  project: string,
  locations: string[]
};
type EditProjectActionType = {
  type: string,
  gitUrl: string,
  project?: string,
  locations?: string[]
};
type DeleteProjectActionType = {
  type: string,
  gitUrl: string
};
type StoreBranchesActionType = {
  type: string,
  gitUrl: string,
  branches: Branch[]
};
type StoreRequestsActionsType = {
  type: string,
  gitUrl: string,
  requests: PullRequest[]
};
type ActionTypes = AddProjectActionType
  | EditProjectActionType
  | DeleteProjectActionType
  | StoreBranchesActionType
  | StoreRequestsActionsType
  | ProjectErrorActionType;

function loadBranches(
  gitUrl: string,
  locations: string[],
  dispatch: (action: StoreBranchesActionType | ProjectErrorActionType) => void): void {
  Promise.all(locations.map(location => git.getBranches(location, gitUrl)))
    .then(allBranches => allBranches
      .reduce(
        (acc, branches) => acc.concat(branches),
        [])
      .reduce(
        (acc, branche) => {
          if (!acc.has(branche.name)) {
            acc.set(branche.name, branche);
          }

          return acc;
        }, new Map()))
    .then(branches => dispatch({
      type: Actions.STORE_BRANCHES,
      gitUrl,
      branches: Array.from(branches.values())
    }))
    .catch((err: Error) => {
      dispatch({
        type: Actions.CANNOT_LOAD_BRANCHES,
        gitUrl,
        error: err
      });
    });
}

const parseGitHubUrl = (() => {
  const GITHUB_FORMAT = /.*:([\w\-_]+)\/([\w\-_]+)(?:.git)*/;
  return (url) => {
    const match = GITHUB_FORMAT.exec(url);
    if (match !== null) {
      return {repository: match[1], project: match[2]};
    } else {
      return null;
    }
  };
})();

function loadPullRequests(
  credentials: any,
  gitUrl: string,
  dispatch: (action: StoreRequestsActionsType | ProjectErrorActionType) => void): void {
  const projectDetails = parseGitHubUrl(gitUrl);
  if (projectDetails !== null) {
    const {repository, project} = projectDetails;
    github.getPullRequests(credentials.token, repository, project)
      .then(requests => dispatch({
        type: Actions.STORE_PULL_REQUESTS,
        gitUrl,
        requests
      }))
      .catch((err: Error) => dispatch({
        type: Actions.CANNOT_LOAD_REQUESTS,
        gitUrl,
        error: err
      }));
  } else {
    console.error('Cannot load PRs for', gitUrl);
  }
}

function addProject(gitUrl: string, projectName: string, locations: string[], credentials: any) {
  return (dispatch: (action: AddProjectActionType | StoreBranchesActionType | StoreRequestsActionsType | ProjectErrorActionType) => void) => {
    const projectAction: AddProjectActionType = {
      type: Actions.ADD_PROJECT,
      project: projectName,
      gitUrl,
      locations
    };
    dispatch(projectAction);

    loadBranches(gitUrl, locations, dispatch);
    loadPullRequests(credentials, gitUrl, dispatch);
  };
}

function editProject(gitUrl: string, projectName: string, locations: string[], credentials: any) {
  return (dispatch: (action: EditProjectActionType | StoreBranchesActionType | StoreRequestsActionsType | ProjectErrorActionType) => void) => {
    dispatch({
      type: Actions.EDIT_PROJECT,
      project: projectName,
      gitUrl,
      locations
    });

    loadBranches(gitUrl, locations, dispatch);
    loadPullRequests(credentials, gitUrl, dispatch);
  };
}



function refreshProject(project: any, credentials: any) {
  return (dispatch: (action: EditProjectActionType | StoreBranchesActionType | StoreRequestsActionsType | ProjectErrorActionType) => void) => {
    loadBranches(project.gitUrl, project.locations, dispatch);
    loadPullRequests(credentials, project.gitUrl, dispatch);
  };
}

function deleteProject(gitUrl: string) {
  return {
    type: Actions.DELETE_PROJECT,
    gitUrl
  };
}

export default {
  Actions,
  Actors: {
    addProject,
    editProject,
    deleteProject,
    refreshProject
  }
};

export type {
 AddProjectActionType,
 EditProjectActionType,
 DeleteProjectActionType,
 StoreBranchesActionType,
 StoreRequestsActionsType,
 ProjectErrorActionType,
 ActionTypes
};
