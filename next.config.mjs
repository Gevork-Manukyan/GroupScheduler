/** @type {import('next').NextConfig} */
const nextConfig = {
  // `next build` and `next dev` both write to .next by default, so building
  // while a dev server is running leaves that server pointing at files the
  // build replaced — it fails with ENOENT on things like
  // .next/server/pages/_document.js until .next is deleted.
  // `npm run build:check` sets this so a verification build can never touch
  // the dev server's output. Deploys are unaffected and still use .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
