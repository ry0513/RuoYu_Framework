// @ts-check
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

import { createServer as createViteServer } from "vite";

export async function createServer() {
  const app = express();
  const resolve = (p: string) =>
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), p);
  app.use((await import("compression")).default());
  app.use(
    "/",
    (await import("serve-static")).default(resolve("dist/client"), {
      index: false,
    })
  );
  app.use("*", async (req, res) => {
    // 服务 index.html - 下面我们来处理这个问题

    const url = req.originalUrl;

    const ssrContext = {
      req,
      res,
    };

    // 1. 读取 index.html
    let template = fs.readFileSync(
      resolve("../dist/client/index.html"),
      "utf-8"
    );

    // 2. 应用 Vite HTML 转换。这将会注入 Vite HMR 客户端，
    //    同时也会从 Vite 插件应用 HTML 转换。
    //    例如：@vitejs/plugin-react 中的 global preambles
    // template = await vite.transformIndexHtml(url, template);

    // 3. 加载服务器入口。vite.ssrLoadModule 将自动转换
    //    你的 ESM 源码使之可以在 Node.js 中运行！无需打包
    //    并提供类似 HMR 的根据情况随时失效。

    const render = (await import("./dist/server/entry-server.js")).render;

    // 4. 渲染应用的 HTML。这假设 entry-server.js 导出的 `render`
    //    函数调用了适当的 SSR 框架 API。
    //    例如 ReactDOMServer.renderToString()
    const { appHtml, preloadLinks, appState, headTags } = await render({
      url,
      ssrContext,
    });

    // 5. 注入渲染后的应用程序 HTML 到模板中。
    const html = template
      .replace(`<!--preload-links-->`, preloadLinks)
      .replace(`<!--app-html-->`, appHtml)
      .replace(`<!--app-state-->`, appState)
      .replace("<!--head-tags-->", headTags);

    // 6. 返回渲染后的 HTML。
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  });
  // @ts-ignore
  return { app };
}

createServer().then(({ app }) =>
  app.listen(process.env.NODE_PORT || 6100, () => {
    console.log(`http://127.0.0.1:${process.env.NODE_PORT || 6100}`);
  })
);
