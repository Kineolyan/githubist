// @flow
import type { Children } from 'react';

import React, { Component } from 'react';
import HeaderBar from '../components/HeaderBar';

export default class App extends Component {
  props: {
    children: Children
  };

  render() {
    return (
      <div className="window">
        <HeaderBar />
        <div className="window-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}
