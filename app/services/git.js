// @flow
import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';

interface Branch {
  name: string,
  localName?: string
}

/**
 * Safely spawn a process, checking its cwd
 */
function spawnProcess(cmd, args, opts): Promise<ChildProcess> {
	return new Promise((resolve, reject) => {
    const cwd = opts.cwd || process.cwd();
    // Check that the cwd exist, otherwise spawn fails
    fs.stat(cwd, err => {
      err
        ? reject(new Error(`Process cwd ${cwd} does not exist`))
        : resolve();
    });
  })
  .then(() => spawn(cmd, args, opts));
}

const REMOTE_EXPR = /^\s*(\w+) (.+) \(push\)\s*$/;
function getRemote(location: string, gitUrl: string): Promise<string> {
  return spawnProcess('git', ['remote', '--verbose'], { cmd: location })
    .then(process => new Promise<string>((resolve, reject) => {
      let resolved: boolean = false;
      process.stdout.on('data', data => {
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
            process.kill(9);

            // Return result
            resolve(remoteName);            
          }
        }
      });

      process.on('close', code => {
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
