// @flow
import type {
  ActionTypes,
  AddProjectActionType,
  EditProjectActionType,
  StoreBranchesActionType,
  StoreRequestsActionsType,
  ProjectErrorActionType
} from '../actions/gits';
import type { Branch } from '../services/git';
import type { PullRequest } from '../services/github';

import gits from '../actions/gits';

const { Actions } = gits;

type GitProjectType = {
  gitUrl: string,
  name: string,
  locations: string[],
  branches: Branch[],
  requests: PullRequest[]
};
type GitStateType = {
  [project: string]: GitProjectType
};

function addProject(state: GitStateType, action: AddProjectActionType): GitStateType {
  if (Reflect.has(state, action.gitUrl)) {
    throw new Error(`Existing project: ${action.gitUrl}`);
  }

  const newProject: GitProjectType = {
    gitUrl: action.gitUrl,
    name: action.project,
    locations: action.locations,
    branches: [],
    requests: []
  };
  return {
    ...state,
    [action.gitUrl]: newProject
  };
}

function editProject(state: GitStateType, action: EditProjectActionType): GitStateType {
  const projectKey = action.gitUrl;
  if (!Reflect.has(state, projectKey)) {
    throw new Error(`Project ${projectKey} does not exist. Use one of [${Object.keys(state).join(', ')}]`);
  }

  const project: GitProjectType = state[projectKey];
  const udpatedProject: GitProjectType = {
    ...project,
    locations: action.locations || project.locations,
    name: action.project || project.name
  };
  return {
    ...state,
    [projectKey]: udpatedProject
  };
}

function storeBranches(state: GitStateType, action: StoreBranchesActionType): GitStateType {
  const project: GitProjectType = {
    ...state[action.gitUrl],
    branches: action.branches
  };
  return {
    ...state,
    [action.gitUrl]: project
  };
}

function storeRequests(state: GitStateType, action: StoreRequestsActionsType): GitStateType {
  const project: GitProjectType = {
    ...state[action.gitUrl],
    requests: action.requests
  };
  return {
    ...state,
    [action.gitUrl]: project
  };
}

function invalidateBranches(state: GitStateType, action: ProjectErrorActionType): GitStateType {
  const project: GitProjectType = {
    ...state[action.gitUrl],
    branches: []
  };
  return {
    ...state,
    [action.gitUrl]: project
  };
}

function invalidateRequests(state: GitStateType, action: ProjectErrorActionType): GitStateType {
  const project: GitProjectType = {
    ...state[action.gitUrl],
    requests: []
  };
  return {
    ...state,
    [action.gitUrl]: project
  };
}

export default function reducer(state: GitStateType = {}, action: ActionTypes | {type: string}) {
  switch (action.type) {
    case Actions.ADD_PROJECT:
      return addProject(state, action);
    case Actions.EDIT_PROJECT:
      return editProject(state, action);
    case Actions.STORE_BRANCHES:
      return storeBranches(state, action);
    case Actions.STORE_PULL_REQUESTS:
      return storeRequests(state, action);
    case Actions.CANNOT_LOAD_BRANCHES:
      return invalidateBranches(state, action);
    case Actions.CANNOT_LOAD_REQUESTS:
      return invalidateRequests(state, action);
    default:
      return state;
  }
}

export type {
  GitProjectType,
  GitStateType
};
