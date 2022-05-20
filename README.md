# oak_proxy

[![Deno](https://github.com/jiawei397/oak_proxy/actions/workflows/deno.yml/badge.svg)](https://github.com/jiawei397/oak_proxy/actions/workflows/deno.yml)

A simple and opinionated proxy middleware for [oak](https://deno.land/x/oak).
Refer to the configuration of
[http-proxy-middleware](https://www.npmjs.com/package/http-proxy-middleware) in
nodejs.

## Example

```typescript
import { CORS } from "https://deno.land/x/oak_cors@v0.1.1/mod.ts";
import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
app.use(CORS());

// other middleware

await app.listen(":80");
```

If you use the default options, it will work as both `origin: true` and
`credentials: true`.
