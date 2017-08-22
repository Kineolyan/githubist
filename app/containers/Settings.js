// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Settings from '../components/Settings';
import settings from '../actions/settings';

function mapStateToProps(state: any, props: any): any {
  return {
    goBack: props.history.goBack,
    settings: state.settings
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateCredentials: settings.Actors.setToken,
      saveCredentials: settings.Actors.saveToken
    },
    dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
