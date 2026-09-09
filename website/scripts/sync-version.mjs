// Copies the CLI version from internal/shared/version.go into lib/version.json.
// The JSON is committed: Docker builds run with --ignore-scripts and have no ../internal.
import fs from "node:fs";
import path from "node:path";

const goFile = path.resolve("../internal/shared/version.go");
const out = path.resolve("lib/version.json");

if (!fs.existsSync(goFile)) {
  console.log("sync-version: version.go not in build context, keeping lib/version.json");
  process.exit(0);
}

const match = /Version\s*=\s*"([^"]+)"/.exec(fs.readFileSync(goFile, "utf8"));
if (!match) throw new Error("sync-version: could not find `Version = \"...\"` in version.go");

fs.writeFileSync(out, JSON.stringify({ version: match[1] }, null, 2) + "\n");
console.log("sync-version:", match[1]);
