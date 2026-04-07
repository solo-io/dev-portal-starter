import { spawn, ChildProcess } from 'child_process';
import { writeFileSync } from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const PID_FILE = path.join(__dirname, '.e2e-pids.json');

function waitForUrl(
  url: string,
  timeoutMs: number,
  acceptAnyResponse = false,
): Promise<void> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      fetch(url)
        .then(res => {
          if (res.ok || acceptAnyResponse) return resolve();
          throw new Error(`${res.status}`);
        })
        .catch(() => {
          if (Date.now() - start > timeoutMs) {
            return reject(new Error(`Timed out waiting for ${url}`));
          }
          setTimeout(check, 2000);
        });
    };
    check();
  });
}

function spawnProcess(
  command: string,
  args: string[],
  cwd: string,
  env?: Record<string, string>,
): ChildProcess {
  const proc = spawn(command, args, {
    cwd,
    stdio: 'pipe',
    detached: true,
    env: { ...process.env, FORCE_COLOR: '0', ...env },
  });
  proc.unref();

  proc.stdout?.on('data', (data: Buffer) => {
    process.stdout.write(`[${path.basename(cwd)}] ${data}`);
  });
  proc.stderr?.on('data', (data: Buffer) => {
    process.stderr.write(`[${path.basename(cwd)}] ${data}`);
  });

  return proc;
}

export default async function globalSetup() {
  console.log('\n=== E2E Setup: Starting infrastructure ===\n');

  // 1. Start Mock Portal API
  console.log('Starting Mock Portal API...');
  const mockApi = spawnProcess(
    'node',
    ['index.js'],
    path.join(ROOT, 'mock-portal-api'),
  );

  // 2. Wait for mock API to be ready
  await waitForUrl('http://localhost:31080/health', 15_000);
  console.log('Mock Portal API ready.');

  // 3. Start the Vite UI dev server on a dedicated e2e port
  const uiPort = process.env.E2E_UI_PORT || '4173';
  console.log(`Starting UI dev server on port ${uiPort}...`);
  const ui = spawnProcess(
    'yarn',
    ['vite', '--port', uiPort, '--strictPort'],
    path.join(ROOT, 'projects', 'ui'),
    { VITE_PORTAL_SERVER_URL: 'http://localhost:31080/v1' },
  );

  // 4. Wait for UI to be ready
  console.log(`Waiting for UI dev server (port ${uiPort})...`);
  await waitForUrl(`http://localhost:${uiPort}`, 120_000, true);
  console.log('UI dev server ready.');

  // Save PIDs for teardown
  writeFileSync(
    PID_FILE,
    JSON.stringify({
      mockApi: mockApi.pid,
      ui: ui.pid,
    }),
  );

  console.log('\n=== E2E Setup: All services running ===\n');
}
