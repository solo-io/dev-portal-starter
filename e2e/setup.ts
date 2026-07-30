import { spawn, ChildProcess, execSync } from 'child_process';
import { writeFileSync } from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const PID_FILE = path.join(__dirname, '.e2e-pids.json');
const IMAGE = process.env.E2E_IMAGE || 'devportal-e2e:latest';
const CONTAINER = 'devportal-e2e';
const UI_PORT = process.env.E2E_UI_PORT || '4173';

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

  // 1. Build the production image from the repo Dockerfile. Running the tests
  //    against the built image (rather than the Vite dev server) means the e2e
  //    suite also exercises what we actually ship: the multi-stage build, the
  //    served static bundle, and runtime VITE_* env injection.
  console.log(`Building image ${IMAGE} from ./Dockerfile ...`);
  execSync(`docker build -t ${IMAGE} .`, { cwd: ROOT, stdio: 'inherit' });
  console.log('Image built.');

  // 2. Start Mock Portal API on the host (the browser calls it directly).
  console.log('Starting Mock Portal API...');
  const mockApi = spawnProcess(
    'node',
    ['index.js'],
    path.join(ROOT, 'mock-portal-api'),
  );

  // 3. Wait for mock API to be ready
  await waitForUrl('http://localhost:31080/health', 15_000);
  console.log('Mock Portal API ready.');

  // 4. Run the built image. The server reads VITE_* config from process.env at
  //    runtime and injects it into the served HTML; the browser then uses it.
  execSync(`docker rm -f ${CONTAINER} 2>/dev/null || true`, { stdio: 'ignore' });
  console.log(`Starting container on port ${UI_PORT}...`);
  execSync(
    `docker run -d --name ${CONTAINER} -p ${UI_PORT}:4000 ` +
      `-e VITE_PORTAL_SERVER_URL=http://localhost:31080/v1 ${IMAGE}`,
    { stdio: 'inherit' },
  );

  // 5. Wait for the containerized server to serve.
  console.log(`Waiting for server (port ${UI_PORT})...`);
  await waitForUrl(`http://localhost:${UI_PORT}`, 60_000, true);
  console.log('Server ready.');

  // Save handles for teardown
  writeFileSync(
    PID_FILE,
    JSON.stringify({
      mockApi: mockApi.pid,
      container: CONTAINER,
    }),
  );

  console.log('\n=== E2E Setup: All services running ===\n');
}
