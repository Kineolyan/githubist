// @flow

interface Branch {
  name: string,
  localName?: string
}

function getBranches(location: string, gitUrl: string): Promise<Branch[]> {
  return Promise.resolve([
    {
      name: 'personal/test',
      localName: 'test'
    }, {
      name: 'some-feature'
    }
  ]);
}

export {
  getBranches
};

export type {
  Branch
};
