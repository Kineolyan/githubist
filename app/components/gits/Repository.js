// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {shell} from 'electron';

import type { GitProjectType } from '../../reducers/gits';

// import styles from './Counter.css';
type RepositoryProps = {
  repository?: GitProjectType,
  deleteProject: (girUrl: string) => void
};

const noop = () => {};

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
        : noop,
      refreshProject: this.hasProject()
        ? () => this.props.refreshProject(this.props.repository, this.props.config)
        : noop
    };
  }

  renderLink(url, text) {
    return (
      <span
        onClick={() => shell.openExternal(url)}
        style={{color: '#00a9ff', textDecoration: 'underline', cursor: 'pointer'}}>
        {text}
      </span>
    );
  }

  hasProject() {
    return this.props.repository !== undefined;
  }

  renderPrStatus(pr) {
    if (pr.closed) {
      return (
        <span
          style={{fontStyle: 'italic', color: '#de8900'}}>
          Closed
        </span>
      );
    } else {
      return (
        <span
          style={{color: '#34c84a', fontWeight: 'bold'}}>
          Open
        </span>
      );
    }
  }

  renderBranch(branch) {
    const remoteName = branch.name.slice('origin'.length + 1);
    const relatedPR = this.props.repository.requests.find(pr => pr.branch === remoteName);
    return (
      <div>
        {branch.name}{branch.localName ? ` (${branch.localName})` : ''}&nbsp;
        {relatedPR !== undefined ? <span>PR: {this.renderLink(relatedPR.htmlUrl, relatedPR.id)}. Status: {this.renderPrStatus(relatedPR)}</span> : null}
      </div>
    );
  }

  renderProject() {
    const requests = this.props.repository.requests;
    return (
      <div>
        <h4>
          Project {this.props.repository.name} <span onClick={this.cbks.deleteProject} className="icon icon-cancel-squared"></span> <span onClick={this.cbks.refreshProject} className="icon icon-arrows-ccw"></span>
        </h4>
        <div>Locations: {this.props.repository.locations.join(', ')}</div>
        <div>Branches
          <ul>
            {this.props.repository.branches.map(branch => (
              <li key={branch.name}>{this.renderBranch(branch)}</li>
            ))}
          </ul>
        </div>
        <div>PRs
          <ul>
            {requests.slice(0, 5).map(request => (
              <li key={request.id}>
                [{request.id}] {request.title}
                &nbsp;{this.renderLink(request.htmlUrl, '(link)')}
              </li>
            ))}
            {requests.length > 5 ? <li>...</li> : null}
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
