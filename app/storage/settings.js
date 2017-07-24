// @flow

class Settings {
  store: any;

  constructor(store) {
    this.store = store;
  }

  initialize() {
    if (!this.store.has('projects')) {
      this.store.setAll({
        projects: {}
      });
    }
    console.log('Settings saved into', this.store.file());
  }

  getProjects() {
    return this.store.get('projects');
  }

  addProject(project: any) {
    this.store.set(`projects.${project.gitUrl}`, project);
  }

  removeProject(gitUrl: string) {
    this.store.delete(`projects.${gitUrl}`);
  }
}

function getSettings(fromRender: boolean = true): Settings {
  let store;
  /* eslint-disable global-require */
  if (fromRender) {
    store = require('electron').remote.require('electron-settings');
  } else {
    store = require('electron-settings');
  }
  /* eslint-enable global-require */

  return new Settings(store);
}

export default getSettings;
