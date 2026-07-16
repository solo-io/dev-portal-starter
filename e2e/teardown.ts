import { execSync } from 'child_process';
import { readFileSync, unlinkSync, existsSync } from 'fs';
import * as path from 'path';

const PID_FILE = path.join(__dirname, '.e2e-pids.json');

function killProcessTree(pid: number) {
  try {
    // Kill the entire process group (negative PID)
    process.kill(-pid, 'SIGTERM');
  } catch {
    // Process may already be gone
  }
}

export default async function globalTeardown() {
  console.log('\n=== E2E Teardown: Stopping services ===\n');

  if (existsSync(PID_FILE)) {
    try {
      const state = JSON.parse(readFileSync(PID_FILE, 'utf-8'));
      if (state.container) {
        console.log(`Removing container ${state.container}...`);
        execSync(`docker rm -f ${state.container} 2>/dev/null || true`, {
          stdio: 'ignore',
        });
      }
      if (state.mockApi) {
        console.log(`Stopping Mock API (PID ${state.mockApi})...`);
        killProcessTree(state.mockApi);
      }
      unlinkSync(PID_FILE);
    } catch (e) {
      console.warn('Warning cleaning up:', e);
    }
  }

  console.log('\n=== E2E Teardown: Complete ===\n');
}
