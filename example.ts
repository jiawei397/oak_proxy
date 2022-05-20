import { Application } from "https://deno.land/x/oak@v10.5.0/mod.ts";
import { proxy } from "./mod.ts";

const app = new Application();

// http://localhost:3000/api?q=deno
app.use(proxy("/api", {
  target: "https://cn.bing.com/search",
  // prependPath: false,
  changeOrigin: true,
  pathRewrite: {
    "^/api": "",
  },
}));

// http://localhost:3000/x/oak_nest@v1.9.2
app.use(proxy("/", {
  target: "https://deno.land/",
  changeOrigin: true,
}));

// app.use(proxy("https://deno.land/"));

app.listen({ port: 3000 });
