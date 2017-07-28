// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Menu extends Component {
  props: {
    repositories: any
  };

  renderRepositoryLinks() {
    return Object.values(this.props.repositories)
      .map(repository => (
        <Link
          key={repository.name}
          to={`/gits/repositories/${repository.name}`}
          className="nav-group-item">
          <span className="icon icon-folder"></span>
          {repository.name}
        </Link>
      ));
  }

  render() {
      // <div style={{ padding: '15px 10px' }}>
    return (
      <nav className="nav-group">
        <h5 className="nav-group-title">Projects</h5>
        {this.renderRepositoryLinks()}
        <Link to="/gits/create"className="nav-group-item">
          <span className="icon icon-plus"></span>
          Add project
        </Link>
      </nav>
    );
  }
}
