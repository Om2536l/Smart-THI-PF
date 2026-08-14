import * as esbuild from "esbuild";
import { cpSync, mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const watch = process.argv.includes("--watch");
const outdir = "dist";

if (existsSync(outdir)) rmSync(outdir, { recursive: true, force: true });
mkdirSync(outdir, { recursive: true });

const buildOptions = {
  entryPoints: { bundle: "src/main.jsx" },
  bundle: true,
  minify: !watch,
  sourcemap: watch ? "inline" : false,
  outdir,
  target: ["es2019"],
  loader: { ".js": "jsx" },
  jsx: "automatic",
  logLevel: "info",
};

function copyPublic() {
  cpSync("public", outdir, { recursive: true });

  // Stamp the service worker with a fresh build ID on every build, so its
  // cache name changes and browsers can't get stuck serving stale assets.
  const swPath = join(outdir, "service-worker.js");
  if (existsSync(swPath)) {
    const buildId = Date.now().toString(36);
    const sw = readFileSync(swPath, "utf8").replace(/__BUILD_ID__/g, buildId);
    writeFileSync(swPath, sw);
  }
}

if (watch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  copyPublic();
  console.log("Watching for changes... (public/ is copied once — re-run build for public/ edits)");
} else {
  await esbuild.build(buildOptions);
  copyPublic();
  console.log("Build complete -> dist/");
}
