// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class HeaderBar extends Component {

  render() {
    // <button className="btn btn-default">
    //   <span className="icon icon-home"></span>
    // </button>

    return (
      <header className="toolbar toolbar-header">
        <h1 className="title">GitHubist</h1>

        <div className="toolbar-actions">
          <button className="btn btn-default pull-right">
            <Link to="/settings">
              <span className="icon icon-cog"></span>
            </Link>
          </button>
        </div>
      </header>
    );
  }
}
