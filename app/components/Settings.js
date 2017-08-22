import React, { Component } from 'react';
import _ from 'lodash';

import type { SettingsStateType } from '../reducers/settings';


type SettingsProps = {
  goBack: () => void,
  updateCredentials: (username: string, token: string) => void,
  saveCredentials: () => void,
  settings: SettingsStateType
};
export default class Settings extends Component {
  props: SettingsProps;

  constructor(props: SettingsProps) {
    super(props);

    const setUsername = _.debounce(this.updateCredentials.bind(this, 'username'), 500);
    const setToken = _.debounce(this.updateCredentials.bind(this, 'token'), 500);
    this.cbks = {
      setUsername: event => setUsername(event.target.value),
      setToken: event => setToken(event.target.value),
      saveCredentials: this.saveCredentials.bind(this)
    };
  }

  updateCredentials(key, value) {
    const credentials = { ...this.props.settings };
    credentials[key] = value;
    this.props.updateCredentials(credentials.username, credentials.token);
  }

  saveCredentials() {
    this.props.saveCredentials();
    this.props.goBack();
  }

  renderStatus() {
    const validity = this.props.settings.tokenValidity;
    if (validity === null) {
      return <span>Checking...&nbsp;</span>;
    } else {
      return <span>({validity ? 'Valid' : 'Invalid'})&nbsp;</span>;
    }
  }

  render() {
    return (
      <div style={{ margin: '10px 15px' }}>
        <form>
          <fieldset>
            <legend>GitHub credentials</legend>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                defaultValue={this.props.settings.username}
                onChange={this.cbks.setUsername}
                placeholder="Username"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                defaultValue={this.props.settings.token}
                onChange={this.cbks.setToken}
                placeholder="Personal access token"
              />
            </div>
            <div className="form-actions">
              {this.renderStatus()}
              <button
                className="btn btn-primary"
                disabled={this.props.settings.tokenValidity === null}
                onClick={this.cbks.saveCredentials}
              >
                Save
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}
