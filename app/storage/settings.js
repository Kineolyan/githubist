// @flow

interface Project {
  gitUrl: string,
  name: string,
  locations: string[]
}

function sanitizeKey(value: string): string {
  return value.replace(/\./g, '_');
}

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

  getProjects(): Project[] {
    const projects: any = Object.values(this.store.get('projects'));
    return (projects: Project[]);
  }

  saveProject(project: Project): void {
    // Keep only wanted attributes of the given project
    const p: Project = {
      gitUrl: project.gitUrl,
      name: project.name,
      locations: project.locations.slice()
    };

    const projectKey = sanitizeKey(p.gitUrl);
    this.store.set(`projects.${projectKey}`, p);
  }

  removeProject(gitUrl: string): void {
    const projectKey = sanitizeKey(gitUrl);
    this.store.delete(`projects.${projectKey}`);
  }

  getCredentials(): {username: string, token: string} | null {
    const credentials = this.store.get('settings.credentials');
    return credentials !== undefined && credentials.username !== undefined && credentials.token !== undefined
      ? credentials
      : null;
  }

  saveCredentials(username: string, token: string) {
    this.store.set('settings.credentials', { username, token });
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
