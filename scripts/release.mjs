import { spawnSync } from "node:child_process";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
    shell: false,
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    if (options.capture && result.stderr) process.stderr.write(result.stderr);
    throw new Error(`${command} ${args.join(" ")} failed with code ${result.status}`);
  }

  return options.capture ? result.stdout.trim() : "";
}

function hasMergeInProgress() {
  const result = spawnSync("git", ["rev-parse", "-q", "--verify", "MERGE_HEAD"], {
    cwd: process.cwd(),
    stdio: "ignore",
    shell: false,
  });
  return result.status === 0;
}

const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error("Run this release through `npm run deploy`.");

const trackedChanges = run(
  "git",
  ["status", "--porcelain", "--untracked-files=no"],
  { capture: true },
);

if (trackedChanges) {
  throw new Error("Tracked files have uncommitted changes. Commit them before deploying.");
}

let completed = false;

try {
  console.log("\nUpdating develop...");
  run("git", ["fetch", "origin", "develop", "main"]);
  run("git", ["switch", "develop"]);
  run("git", ["pull", "--ff-only", "origin", "develop"]);

  console.log("\nChecking the release...");
  run(process.execPath, [npmCli, "run", "lint"]);
  run(process.execPath, [npmCli, "run", "build"]);

  console.log("\nMerging develop into main...");
  run("git", ["switch", "main"]);
  run("git", ["pull", "--ff-only", "origin", "main"]);
  run("git", ["merge", "--no-ff", "develop", "-m", "merge: release develop to main"]);
  run("git", ["push", "origin", "main"]);

  completed = true;
  console.log("\nRelease pushed to origin/main successfully.");
} finally {
  if (!hasMergeInProgress()) {
    run("git", ["switch", "develop"]);
  } else {
    console.error("\nMerge conflict detected. Resolve it on main before continuing.");
  }

  if (!completed) process.exitCode = 1;
}
