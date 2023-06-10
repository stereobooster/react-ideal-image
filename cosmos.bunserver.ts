import { rm, stat } from "node:fs/promises";
import type { ServeOptions } from "bun";
import * as path from "path";

import cosmosConfig from "./cosmos.config.json";

const PROJECT_ROOT = import.meta.dir;
const BUILD_DIR = path.resolve(PROJECT_ROOT, "build");

const waitForCosmosImports = async () => {
  const fpath = `${PROJECT_ROOT}/cosmos.imports.ts`;
  try {
    const cosmosImports = await stat(fpath);
    if (!cosmosImports.isFile()) {
      throw new Error(`
        file doesnt exist yet
      `);
    }
  } catch {
    return new Promise((resolve) => {
      setTimeout(() => resolve(waitForCosmosImports()), 1000);
    });
  }
};

const buildApp = async () =>
  rm(BUILD_DIR, { force: true, recursive: true }).then(() =>
    Bun.build({
      entrypoints: ["./cosmos.entrypoint.tsx"],
      target: "browser",
      outdir: "build",
    })
      .then((output) => output)
      .catch((e) => {
        console.info("\n\n error in build", e);
      })
  );

await waitForCosmosImports();
await buildApp().then((output) => {
  if (output.success)
    console.info(
      `app built: ${output.success}; ${output.outputs.length} files `
    );
  else {
    for (const message of output.logs) {
      // Bun will pretty print the message object
      console.error(message);
    }
    throw new Error(`build failed`);
  }
});

const returnIndex = () => {
  const index = `
    <!DOCTYPE html>
    <html lang="en">
    <body>
      <script src="${BUILD_DIR}/cosmos.entrypoint.js" type="module">
      </script>
    </body>
    </html>
  `;

  return new Response(index, {
    headers: {
      "Content-Type": "text/html",
      "Access-Control-Allow-Origin": "*",
    },
  });
};

async function serveFromDir(config: {
  directory?: string;
  path: string;
}): Promise<Response | null> {
  const filepath = path.join(config.directory || "", config.path);

  try {
    const fd = await stat(filepath);
    if (fd && fd.isFile()) {
      return new Response(Bun.file(filepath), {
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }
  } catch (err) {}

  return null;
}
export default {
  port: 5050,
  hostname: "0.0.0.0",
  async fetch(req) {
    const reqPath = new URL(req.url).pathname;
    console.log(req.method, reqPath);

    if (reqPath === "/") return returnIndex();
    else {
      const filepath = req.url.replace(cosmosConfig.rendererUrl, "");

      const exactResponse = await serveFromDir({ path: filepath });
      if (exactResponse) return exactResponse;

      const buildResponse = await serveFromDir({
        directory: BUILD_DIR,
        path: filepath,
      });
      if (buildResponse) return buildResponse;

      return new Response("File not found", {
        status: 404,
      });
    }
  },
} satisfies ServeOptions;

// watch imports
await import("./cosmos.imports.ts").catch((e) => e);
