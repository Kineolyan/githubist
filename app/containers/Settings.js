//@flow
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Settings from '../components/Settings';

function mapStateToProps(state: any, props: any): any {
  return {
    goBack: props.history.goBack
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
