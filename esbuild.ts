/**
 * This is the build script for the project.
 *
 * It takes the source code and bundles it into a single file
 * that can be imported into an inlang project.
 */

import { context } from "esbuild";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

const ctx = await context({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  // minification is disabled in dev mode for better debugging
  minify: !process.env.DEV,
  format: "esm",
  platform: "browser",
  target: "es2020",
  plugins: [
    // by default node polyfills are included
    // as a lot of npm packages that deal with files
    // use built-in node modules
    NodeModulesPolyfillPlugin(),
    {
      name: "logger",
      setup: ({ onEnd }) => onEnd(() => console.info("🎉 changes processed"))
    }
  ],
});

if (process.env.DEV) {
  await ctx.watch();
  console.info("👀 watching for changes...");
  process.on("exit", async () => {
    console.info("🙈 process killed");
    await ctx.dispose();
  });
} else {
  await ctx.rebuild();
  console.info("✅ build complete");
  await ctx.dispose();
}
