// @flow
import React, { Component } from 'react';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';

import type { GitStateType } from '../../reducers/gits';

import Repository from '../../containers/gits/Repository';

// import styles from './Counter.css';
type RepositoryProps = {
  repositories: GitStateType,
  addProject: (gitUrl: string, project: string, locations: string[]) => void
};

class Repositories extends Component {
  props: RepositoryProps;

  state: {
    projectName: string,
    gitUrl: string,
    location: string
  };

  constructor(props: RepositoryProps) {
    super(props);

    this.state = {
      projectName: 'test',
      gitUrl: 'git-url',
      location: 'some/where'
    };

    this.cbks = {
      createProject: this.createProject.bind(this),
      setProject: event => this.setState({ projectName: event.target.value }),
      setGitUrl: event => this.setState({ gitUrl: event.target.value }),
      setLocation: event => this.setState({ location: event.target.value })
    };
  }

  createProject(): void {
    this.props.addProject(this.state.gitUrl, this.state.projectName, [this.state.location]);
    this.setState({
      projectName: '',
      gitUrl: '',
      location: ''
    });
  }

  renderList() {
    const repos = Object.keys(this.props.repositories)
      .map(url => this.props.repositories[url])
      .map(repository => (
        <li key={repository.gitUrl}>
          <Link to={`/repositories/${repository.name}`}>{repository.name}</Link>
        </li>
      ));
    return <ul>{repos}</ul>;
  }

  renderRepository() {
    return <Route path="/repositories/:projectName" component={Repository} />;
  }

  renderForm() {
    return (
      <div>
        Add new project:<br />
        <input
          type="text"
          value={this.state.projectName}
          onChange={this.cbks.setProject}
          placeholder="Project name"
        />
        <br />
        <input
          type="text"
          value={this.state.gitUrl}
          onChange={this.cbks.setGitUrl}
          placeholder="GitHub URL"
        />
        <br />
        <input
          type="text"
          value={this.state.location}
          onChange={this.cbks.setLocation}
          placeholder="Location"
        />
        <br />
        <button onClick={this.cbks.createProject}>Create</button>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div>
          {Object.keys(this.props.repositories).length} repositories
        </div>
        {this.renderList()}
        <hr />
        {this.renderRepository()}
        <hr />
        {this.renderForm()}
        <div>
          <Link to="/">Back</Link>
        </div>
      </div>
    );
  }
}

export default Repositories;
