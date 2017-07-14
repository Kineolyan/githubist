// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import type { GitProjectType } from '../../reducers/gits';

// import styles from './Counter.css';

class Repository extends Component {
  props: {
    repository?: GitProjectType
  };

  static defaultProps = {
    repository: undefined
  }

  renderProject() {
    return (
      <div>
        <h4>Project {this.props.repository.name}</h4>
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
        {this.props.repository !== undefined ? this.renderProject() : (<p>No project here</p>)}
        <div>
          <Link to="/repositories">Back to project</Link>
        </div>
      </div>
    );
  }
}

export default Repository;
