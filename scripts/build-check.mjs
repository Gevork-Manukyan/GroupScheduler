// Run a production build without touching .next, so it is safe to verify a
// build while `npm run dev` is running. Sharing .next between the two leaves
// the dev server pointing at files the build replaced, which surfaces as
// ENOENT on .next/server/pages/_document.js and is only fixed by deleting
// .next and restarting.
//
// Deploys still use `npm run build` and the normal .next directory.
import { spawnSync } from "node:child_process";

const result = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NEXT_DIST_DIR: ".next-check" },
});

process.exit(result.status ?? 1);
