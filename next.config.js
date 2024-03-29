/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
// allow avatars.githubusercontent.com in images
const config = {
    images: {
        domains: ["avatars.githubusercontent.com", "utfs.io"],
    }
};

export default config;
