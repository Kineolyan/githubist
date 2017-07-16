import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Repositories from '../../components/gits/Repositories';
import gits from '../../actions/gits';

function mapStateToProps(state) {
  return {
    repositories: state.repositories
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      addProject: gits.Actors.addProject,
      deleteProject: gits.Actors.deleteProject
    },
    dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Repositories);