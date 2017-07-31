import React, { Component } from 'react';

export default class Settings extends Component {
  props: {
    goBack: () => void
  }

  render() {
    return (
      <button
        className="btn btn-primary"
        onClick={this.props.goBack}
      >
        Save
      </button>
    );
  }
}
