// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import type { GitProjectType } from '../../reducers/gits';
import type { StateType } from '../../reducers';

import gits from '../../actions/gits';
import Repository from '../../components/gits/Repository';

function mapStateToProps(state: StateType, props: any): any {
  const projectName: string = props.match.params.projectName;
  return {
    repository: _(state.repositories)
      .values()
      .filter((repository: GitProjectType) => repository.name === projectName)
      .first(),
    config: state.settings
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      deleteProject: gits.Actors.deleteProject,
      refreshProject: gits.Actors.refreshProject
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Repository);
