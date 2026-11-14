// Deploys a prebuilt `dist/` tarball as a static AppWrite Site, then points
// the site's hostname at it. Run by .github/workflows/deploy.yml.
//
//   node scripts/deploy.mjs <tarball>
//
// Env: APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY (required),
//      SITE_ID (default `makeaface`), SITE_HOSTNAME (default `makeaface.camcap.dev`).

import {
  Adapter,
  AppwriteException,
  BuildRuntime,
  Client,
  Framework,
  Proxy,
  Query,
  Sites,
} from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';

const tarball = process.argv[2];
if (!tarball) throw new Error('Usage: node scripts/deploy.mjs <tarball>');

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

const siteId = process.env.SITE_ID || 'makeaface';
const hostname = process.env.SITE_HOSTNAME || 'makeaface.camcap.dev';

const client = new Client()
  .setEndpoint(requireEnv('APPWRITE_ENDPOINT'))
  .setProject(requireEnv('APPWRITE_PROJECT_ID'))
  .setKey(requireEnv('APPWRITE_API_KEY'));
const sites = new Sites(client);
const proxy = new Proxy(client);

// The tarball already holds the built files, so AppWrite has nothing to
// install or build: it serves the archive's root as-is.
const settings = {
  siteId,
  name: 'Make A Face',
  framework: Framework.Other,
  adapter: Adapter.Static,
  buildRuntime: BuildRuntime.Node22,
  installCommand: '',
  buildCommand: '',
  outputDirectory: './',
  fallbackFile: 'index.html',
  logging: true,
  enabled: true,
};

async function ensureSite() {
  try {
    await sites.get({ siteId });
    await sites.update(settings);
    console.log(`Updated site ${siteId}`);
  } catch (e) {
    if (!(e instanceof AppwriteException && e.code === 404)) throw e;
    await sites.create(settings);
    console.log(`Created site ${siteId}`);
  }
}

async function waitReady(deploymentId) {
  const deadline = Date.now() + 5 * 60_000;
  for (;;) {
    const d = await sites.getDeployment({ siteId, deploymentId });
    if (d.status === 'ready') return;
    if (d.status === 'failed' || d.status === 'canceled') {
      throw new Error(`Deployment ${d.$id} ${d.status}:\n${d.buildLogs}`);
    }
    if (Date.now() > deadline) {
      throw new Error(`Deployment ${d.$id} still ${d.status} after 5 min`);
    }
    await new Promise((r) => setTimeout(r, 3_000));
  }
}

async function ensureRule() {
  const { rules } = await proxy.listRules({
    queries: [Query.equal('domain', hostname)],
  });
  const rule = rules[0];
  if (!rule) {
    await proxy.createSiteRule({ domain: hostname, siteId });
    console.log(`Created proxy rule ${hostname} -> ${siteId}`);
    return;
  }
  if (
    rule.deploymentResourceType !== 'site' ||
    rule.deploymentResourceId !== siteId
  ) {
    throw new Error(
      `${hostname} already points at ${rule.deploymentResourceId}, not ${siteId}`,
    );
  }
}

await ensureSite();
const deployment = await sites.createDeployment({
  siteId,
  code: InputFile.fromPath(tarball, `${siteId}.tar.gz`),
  installCommand: '',
  buildCommand: '',
  outputDirectory: './',
  activate: true,
});
console.log(`Uploaded deployment ${deployment.$id}`);
await waitReady(deployment.$id);
console.log(`Deployment ${deployment.$id} is ready`);
await ensureRule();
console.log(`Live at https://${hostname}`);
