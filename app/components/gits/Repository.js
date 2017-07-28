// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import type { GitProjectType } from '../../reducers/gits';

// import styles from './Counter.css';
type RepositoryProps = {
  repository?: GitProjectType,
  deleteProject: (girUrl: string) => void
};

class Repository extends Component {
  props: RepositoryProps;

  static defaultProps = {
    repository: undefined
  }

  constructor(props: RepositoryProps) {
    super(props);

    this.cbks = {
      deleteProject: this.hasProject()
        ? () => this.props.deleteProject(this.props.repository.gitUrl)
        : () => {}
    };
  }

  hasProject() {
    return this.props.repository !== undefined;
  }

  renderProject() {
    return (
      <div>
        <h4>
          Project {this.props.repository.name} <span onClick={this.cbks.deleteProject}>[x]</span>
        </h4>
        <div>Locations: {this.props.repository.locations.join(', ')}</div>
        <div>Branches
          <ul>
            {this.props.repository.branches.map(branch => (
              <li key={branch.name}>{branch.name}{branch.localName ? ` (${branch.localName})` : ''}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.hasProject() ? this.renderProject() : (<p>No project here</p>)}
        <div>
          <Link to="/gits/repositories">Back to project</Link>
        </div>
      </div>
    );
  }
}

export default Repository;
