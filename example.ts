import { Application } from "https://deno.land/x/oak@v10.5.0/mod.ts";
import { proxy } from "./mod.ts";

const controller = new AbortController();

export function serve(app: Application, port: number) {
  //   app.use(proxy("https://github.com/oakserver/oak"));
  // Add some middleware using `app.use()`
  const { signal } = controller;
  return app.listen({ port, signal });
}

export function shutdown() {
  controller.abort();
}

const app = new Application();

// app.addEventListener("error", (event) => {
//   console.log(event.error);
// });

app.use(proxy("/ams-api", {
  target: "https://ams.udolphin.com/mock/280/",
  // prependPath: false,
  changeOrigin: true,
  pathRewrite: {
    "^/ams-api": "/api",
  },
}));

app.use(proxy("/", {
  target: "https://deno.land/",
  // target: "http://localhost:8080/https/deno.land/",
  changeOrigin: true,
}));

// app.use(proxy("https://deno.land/"));
// const router = new Router();
// router.get(
//   "/api/:path",
//   //   proxy("https://ams.udolphin.com/mock/280/", {
//   //     secure: true,
//   //   }),
//   async (ctx) => {
//     console.log(ctx.request.url);
//     // await fetch()
//     ctx.response.body = "Hello World!";
//   },
// );

// app.use(proxy("https://deno.land/x/"));

// app.use(router.routes());
// app.use(router.allowedMethods());

serve(app, 3000);

// setTimeout(() => {
//   shutdown();
// }, 5000);
