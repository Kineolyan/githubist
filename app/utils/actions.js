// @flow

function nameActions(actions: {[key: string]: string}, prefix?: string): void {
  const value: (string) => string = prefix !== undefined
    ? ((key) => `${prefix}_${key}`)
    : ((key) => key);
  Object.keys(actions).forEach(key => {
    actions[key] = value(key); // eslint-disable-line no-param-reassign
  });
}

export {
  nameActions
};
