import { spawnSync } from "node:child_process";
import { loadSite } from "./load-site.mjs";

const { config } = loadSite();
const configPath = `sites/${config.id}/wrangler.jsonc`;

const build = spawnSync("npm", ["run", "build"], { stdio: "inherit" });
if (build.status !== 0) process.exit(build.status ?? 1);

const deploy = spawnSync("npx", ["wrangler", "deploy", "-c", configPath], {
  stdio: "inherit",
});
process.exit(deploy.status ?? 1);
