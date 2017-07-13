// @flow
import type {
  actionType,
  ActionTypes,
  AddProjectActionType,
  EditProjectActionType,
  StoreBranchesActionType,
  StoreRequestsActionsType,
  ProjectErrorActionType
} from '../actions/gits';
import type { Branch } from '../services/git';

import gits from '../actions/gits';

const { Actions } = gits;

type GitStateType = {
  [project: string]: {
    name: string,
    locations: string[],
    branches: Branch[]
  }
};

function addProject(state: GitStateType, action: AddProjectActionType): GitStateType {
  if (Reflect.has(state, action.gitUrl)) {
    throw new Error(`Existing project: ${action.gitUrl}`);
  }

  return {
    ...state,
    [action.gitUrl]: {
      name: action.project,
      locations: action.locations,
      branches: []
    }
  };
}

function editProject(state: GitStateType, action: EditProjectActionType): GitStateType {
  const projectKey = action.gitUrl;
  if (!Reflect.has(state, projectKey)) {
    throw new Error(`Project ${projectKey} does not exist. Use one of [${Object.keys(state).join(', ')}]`);
  }

  const project = state[projectKey];
  return {
    ...state,
    [projectKey]: {
      ...project,
      locations: action.locations || project.locations,
      name: action.project || project.name
    }
  };
}

function saveBranches(state: GitStateType, action: StoreBranchesActionType): GitStateType {
  return {
    ...state,
    [action.gitUrl]: {
      ...state[action.gitUrl],
      branches: []
    }
  };
}

export default function counter(state: GitStateType = {}, action: ActionTypes) {
  switch (action.type) {
    case Actions.ADD_PROJECT:
      return addProject(state, action);
    case Actions.EDIT_PROJECT:
      return editProject(state, action);
    case Actions.STORE_BRANCHES:
      return saveBranches(state, action);
    case Actions.STORE_PULL_REQUESTS:
      return saveRequests(state, action);
    case Actions.CANNOT_LOAD_BRANCHES:
      return invalidateBranches(state, action);
    case Actions.CANNOT_LOAD_REQUESTS:
      return invalidateRequests(state, action);
    default:
      return state;
  }
}

export type {
  GitStateType
};
