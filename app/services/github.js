// @flow

const GIT_API: string = 'https://api.github.com';

interface PullRequest {
  id: number,
  branch: string,
  title: string,
  reviewers: string[],
  closed?: boolean,
  url: string
}

function authenticateCall(token: string, headers: Headers = new Headers()) {
  headers.append('Authorization', `token ${token}`);
  return headers;
}

function checkToken(token: string): Promise<boolean> {
  const headers = authenticateCall(token);
  return fetch(
    `${GIT_API}/user/repos`,
    {
      method: 'GET',
      headers
    })
    .then(
      response => response.ok,
      () => false);
}

function accumulateRequests(out: PullRequest[], requests: any[], oldestTimestamp: number): boolean {
  for (const request of requests) {
    const lastUpdate = new Date(request.updated_at).getTime();
    if (lastUpdate < oldestTimestamp) {
      return false;
    }

    out.push({
      id: request.number,
      branch: request.head.ref,
      base: request.base.ref,
      title: request.title,
      reviewers: [],
      closed: request.closed_at !== null || request.merged_at !== null,
      url: request.url,
      htmlUrl: request.html_url
    });
  }

  return true;
}

async function getPullRequests(token: string, repository: string, project: string): PullRequest[] {
  const headers = authenticateCall(token);
  const url = pageId => `${GIT_API}/repos/${repository}/${project}/pulls?state=all&per_page=25&page=${pageId}&sort=created&direction=desc`;
  const oldestTimestamp = Date.now() - 1000 * 60 * 60 * 24 * 30 * 3; // 3-month old

  const requests: PullRequest[] = [];
  for (let i = 0; i < 20 ; i += 1) {
    const pageRequests: any[] = await fetch(
        url(i),
        {
          method: 'GET',
          headers
        })
      .then(response => response.json());
    if (pageRequests.length === 0) {
      break;
    }
    if (!accumulateRequests(requests, pageRequests, oldestTimestamp)) {
      break;
    }
  }

  return requests;
}

export {
  checkToken,
  getPullRequests
};

export type {
  PullRequest
};
