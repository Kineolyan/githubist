// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { goBack } from 'react-router-redux';

import Settings from '../components/Settings';
import settings from '../actions/settings';

function mapStateToProps(state: any): any {
  return {
    settings: state.settings
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      goBack,
      updateCredentials: settings.Actors.setToken,
      saveCredentials: settings.Actors.saveToken
    },
    dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
