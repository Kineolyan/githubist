// @flow

interface PullRequest {
  id: string,
  branch: string,
  reviewers: string[],
  closed?: boolean,
  url: string
}

function getPullRequests(): Promise<PullRequest[]> {
  return Promise.resolve([
    {
      id: '1342',
      branch: 'some-feature',
      reviewers: [],
      closed: false,
      url: 'github-url'
    }, {
      id: '3958',
      branch: 'another-feature',
      reviewers: ['Sam', 'Ben'],
      url: 'github-url-2'
    }
  ]);
}

export {
  getPullRequests
};

export type {
  PullRequest
};
