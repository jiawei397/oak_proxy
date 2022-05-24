# oak_proxy

[![Deno](https://github.com/jiawei397/oak_proxy/actions/workflows/deno.yml/badge.svg)](https://github.com/jiawei397/oak_proxy/actions/workflows/deno.yml)

A simple and opinionated proxy middleware for [oak](https://deno.land/x/oak).
Refer to the configuration of
[http-proxy-middleware](https://www.npmjs.com/package/http-proxy-middleware) in
nodejs.

## Example

```typescript
import { Application } from "https://deno.land/x/oak@v10.5.0/mod.ts";
import { proxy } from "https://deno.land/x/oak_proxy@v0.0.2/mod.ts";

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

// other middleware

app.listen({ port: 80 });
```
