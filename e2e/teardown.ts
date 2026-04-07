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

  // Kill spawned processes
  if (existsSync(PID_FILE)) {
    try {
      const pids = JSON.parse(readFileSync(PID_FILE, 'utf-8'));
      if (pids.mockApi) {
        console.log(`Stopping Mock API (PID ${pids.mockApi})...`);
        killProcessTree(pids.mockApi);
      }
      if (pids.ui) {
        console.log(`Stopping UI dev server (PID ${pids.ui})...`);
        killProcessTree(pids.ui);
      }
      unlinkSync(PID_FILE);
    } catch (e) {
      console.warn('Warning cleaning up PIDs:', e);
    }
  }

  console.log('\n=== E2E Teardown: Complete ===\n');
}
