// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// import styles from './Counter.css';
type RepositoryProps = {
  addProject: (gitUrl: string, project: string, locations: string[]) => void
};

class AddRepository extends Component {
  props: RepositoryProps;

  state: {
    projectName: string,
    gitUrl: string,
    location: string
  };

  constructor(props: RepositoryProps) {
    super(props);

    this.state = {
      projectName: '',
      gitUrl: '',
      location: ''
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

  renderForm() {
    return (
      <div>
        Add new project:<br />
        <form>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              value={this.state.projectName}
              onChange={this.cbks.setProject}
              placeholder="Project name"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
                className="form-control"
              value={this.state.gitUrl}
              onChange={this.cbks.setGitUrl}
              placeholder="GitHub URL"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              value={this.state.location}
              onChange={this.cbks.setLocation}
              placeholder="Location"
            />
          </div>
          <div className="form-actions">
            <button
              className="btn btn-primary"
              onClick={this.cbks.createProject}>
                Create
            </button>
          </div>
        </form>
      </div>
    );
  }

  render() {
    return (
      <div style={{ padding: '15px 10px' }}>
        {this.renderForm()}
        <div>
          <Link to="/">Back</Link>
        </div>
      </div>
    );
  }
}

export default AddRepository;
