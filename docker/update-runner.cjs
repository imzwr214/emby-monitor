const { DockerSelfUpdater } = require('./self-update.cjs');

async function main() {
  const containerId = String(process.env.DOCKER_CONTAINER_ID || '').trim();
  if (!containerId) throw new Error('Missing DOCKER_CONTAINER_ID');

  const updater = new DockerSelfUpdater({
    enabled: '1',
    image: process.env.DOCKER_UPDATE_IMAGE || '',
    containerId,
    socketPath: process.env.DOCKER_SOCKET_PATH || '/var/run/docker.sock'
  });

  await updater.runSelfUpdate({
    latestVersion: process.env.DOCKER_UPDATE_LATEST_VERSION || ''
  });
}

main()
  .then(() => {
    console.log('[docker-update-runner] completed');
  })
  .catch((error) => {
    console.error('[docker-update-runner] failed:', error && error.stack ? error.stack : error);
    process.exitCode = 1;
  });
