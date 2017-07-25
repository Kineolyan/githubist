
import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';

interface Branch {
  name: string,
  localName?: string
}

/**
 * Safely spawn a process, checking its cwd
 */
function spawnProcess(cmd: string, args: string[], opts: {cwd?: string}): Promise<ChildProcess> {
  return new Promise((resolve, reject) => {
    const cwd = opts.cwd || process.cwd();
    // Check that the cwd exist, otherwise spawn fails
    fs.stat(cwd, err => {
      if (err) {
        reject(new Error(`Process cwd ${cwd} does not exist`));
      } else {
        resolve();
      }
    });
  })
  .then(() => spawn(cmd, args, opts));
}

const REMOTE_EXPR = /^\s*(\w+)\s(.+)\s\(push\)\s*$/;
function getRemote(location: string, gitUrl: string): Promise<string | undefined> {
  return spawnProcess('git', ['remote', '--verbose'], { cwd: location })
    .then(p => new Promise((resolve, reject) => {
      let resolved: boolean = false;
      p.stdout.on('data', data => {
        if (resolved) {
          return;
        }

        const lines = data.toString().split('\n');
        for (const line of lines) {
          const matches = REMOTE_EXPR.exec(line);
          if (matches && matches[2] === gitUrl) {
            const remoteName = matches[1];
            resolved = true;

            // Stop process not to have more lines
            p.kill('SIGKILL');

            // Return result
            resolve(remoteName);
          }
        }
      });

      p.on('close', code => {
        if (!resolved) {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Cannot get remote: ${code}`));
          }
        }
      });
    }));
}

// * master ce07a68 [origin/master] Add real code to get branches.
//  test   ce07a68 Add real code to get branches.
const BRANCH_EXPR = /^\s*[*\s]\s(.+)\s[0-9a-f]+\s(?:(?:\[(.+?)(?:: .+)?\])?)\s.+$/;
function listBranches(location: string, remote?: string): Promise<Branch[]> {
  return spawnProcess('git', ['branch', '-vv'], { cwd: location })
    .then(process => new Promise((resolve, reject) => {
      const branches: Branch[] = [];
      const remotePattern = remote !== undefined ? new RegExp(`^remotes/${remote}/`) : /remotes\//;
      process.stdout.on('data', data => {
        for (const line of data.toString().split('\n')) {
          const matches = BRANCH_EXPR.exec(line);
          if (matches) {
            const name = matches[1];
            const remoteName = matches[2];
            if (name !== undefined && remoteName !== undefined) {
              branches.push({
                name: remoteName.trim(),
                localName: name.trim()
              });
            } else if (remotePattern.test(name)) {
              branches.push({
                name: name.substring(8).trim() // 'remotes/'.length
              });
            }
          }
        }
      });

      process.on('close', code => {
        if (code === 0) {
          resolve(branches);
        } else {
          reject(new Error(`Cannot list branches in ${location}: ${code}`));
        }
      });
    }));
}

function getBranches(location: string, gitUrl: string): Promise<Branch[]> {
  return getRemote(location, gitUrl)
    .then(remote => listBranches(location, remote));
  // return Promise.resolve([
  //   {
  //     name: 'personal/test',
  //     localName: 'test'
  //   }, {
  //     name: 'some-feature'
  //   }
  // ]);
}

export {
  getBranches
};

export type {
  Branch
};
