import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AddRepository from '../../components/gits/AddRepository';
import gits from '../../actions/gits';

function mapStateToProps(state) {
  return {
    repositories: state.repositories
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      addProject: gits.Actors.addProject
    },
    dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddRepository);
