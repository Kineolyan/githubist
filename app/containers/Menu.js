import { connect } from 'react-redux';

import Menu from '../components/Menu';

function mapStateToProps(state) {
  return {
    repositories: state.repositories
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
