import { basename } from "node:path";
import { renderToString } from "vue/server-renderer";
import { createApp } from "./main";
import { renderHeadToString } from "@vueuse/head";
import type { Request, Response } from "express";

const renderPreloadLink = (file: string) => {
  if (file.endsWith(".js")) {
    return `<link rel="modulepreload" crossorigin href="${file}">`;
  } else if (file.endsWith(".css")) {
    return `<link rel="stylesheet" href="${file}">`;
  } else if (file.endsWith(".woff")) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
  } else if (file.endsWith(".woff2")) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
  } else if (file.endsWith(".gif")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`;
  } else if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`;
  } else if (file.endsWith(".png")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`;
  }
  // TODO
  return "";
};

const renderPreloadLinks = (modules: any[], manifest: Record<string, any>) => {
  let links = "";
  const seen = new Set();
  modules.forEach((id) => {
    const files = manifest[id];
    if (files) {
      files.forEach((file: string) => {
        if (!seen.has(file)) {
          seen.add(file);
          const filename = basename(file);
          if (manifest[filename]) {
            for (const depFile of manifest[filename]) {
              links += renderPreloadLink(depFile);
              seen.add(depFile);
            }
          }
          links += renderPreloadLink(file);
        }
      });
    }
  });
  return links;
};

const replaceHtmlTag = (html: string) => {
  return html
    .replace(/<script(.*?)>/gi, "&lt;script$1&gt;")
    .replace(/<\/script>/g, "&lt;/script&gt;");
};

export async function render({
  url,
  manifest = {},
  ssrContext,
}: {
  url: string;
  manifest: Record<string, string[]>;
  ssrContext: { req: Request; res: Response };
}) {
  const { app, store, router, head } = createApp();
  await router.push(url);
  await router.isReady();

  const matchedComponents = router.currentRoute.value.matched.flatMap(
    (record: any) => Object.values(record.components)
  );
  try {
    await Promise.all(
      matchedComponents
        .map((component: any) => {
          if (component.asyncData) {
            return component.asyncData({
              store,
              route: router.currentRoute.value,
            });
          }
          return null;
        })
        .filter(Boolean)
    );
  } catch (error) {
    console.log(error);
  }
  const ctx: Record<string, any> = {};
  let appHtml = await renderToString(app, ctx);
  const { headTags } = await renderHeadToString(head);
  const appState = replaceHtmlTag(JSON.stringify(store.state.value));
  const preloadLinks = renderPreloadLinks(ctx.modules, manifest);
  return { appHtml, preloadLinks, appState, headTags };
}
