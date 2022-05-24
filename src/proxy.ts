import { Context, Middleware, Next, ProxyOptions } from "./types.ts";

export function join(...paths: string[]) {
  return paths.reduce((acc, path) => {
    if (path.startsWith("/")) {
      path = path.substring(1);
    }
    if (acc.endsWith("/")) {
      return acc + path;
    } else {
      return acc + "/" + path;
    }
  });
}

function timeoutPromise(
  promise: Promise<unknown>,
  options: {
    timeoutMsg: string;
    abortController?: AbortController;
    timeout?: number;
  },
) {
  const { timeoutMsg, timeout, abortController } = options;
  if (!timeout) {
    return promise;
  }
  let st: number;
  const tp = new Promise((_, reject) => {
    st = setTimeout(() => {
      abortController?.abort();
      reject(timeoutMsg);
    }, timeout);
  });
  return Promise.race([
    promise.then((data) => {
      clearTimeout(st);
      return data;
    }, (err) => {
      clearTimeout(st);
      return Promise.reject(err);
    }),
    tp,
  ]);
}

async function dealProxy(path: string, ctx: Context, options: ProxyOptions) {
  try {
    const url = new URL(path);

    const proxyHeaders = new Headers(ctx.request.headers);
    if (options.headers) {
      for (const [key, value] of Object.entries(options.headers)) {
        proxyHeaders.set(key, value);
      }
    }
    if (options.changeOrigin) {
      proxyHeaders.set("host", url.origin);
      proxyHeaders.set("origin", url.origin);
      const originReferer = proxyHeaders.get("referer");
      if (originReferer) {
        const originUrl = ctx.request.url;
        proxyHeaders.set(
          "referer",
          originReferer.replace(originUrl.origin, url.origin),
        );
      }
    }

    const method = ctx.request.method;
    const result = ctx.request.hasBody
      ? await ctx.request.body({
        type: "bytes",
      })
      : null;
    const body = result && await result.value;
    const controller = new AbortController();
    const proxyRequest = {
      headers: proxyHeaders,
      body,
      method,
      signal: controller.signal,
    };
    if (options.onProxyReq) {
      options.onProxyReq(proxyRequest, ctx.request);
    }
    const promise = fetch(url.href, proxyRequest);
    const proxyResponse = await timeoutPromise(promise, {
      timeoutMsg: "proxy timeout",
      abortController: controller,
      timeout: options.proxyTimeout,
    }) as Response;
    const buffer = await proxyResponse.arrayBuffer();
    if (options.onProxyRes) {
      options.onProxyRes(buffer, proxyResponse, ctx);
    } else {
      ctx.response.body = buffer;
    }
  } catch (error) {
    if (options.onProxyError) {
      options.onProxyError(error, ctx);
    } else {
      throw error;
    }
  }
}

function getMiddleware(key: string, options: ProxyOptions): Middleware {
  if (options.prependPath === undefined) {
    options.prependPath = true;
  }
  return async (ctx: Context, next: Next) => {
    const originUrl = ctx.request.url;
    let pathname = originUrl.pathname;
    const pattern = new URLPattern({ pathname: key });
    const isMatch = pattern.test(ctx.request.url.href);
    if (!isMatch && !pathname.startsWith(key)) {
      // console.log(`${key} not match ${pathname}`);
      return next();
    }
    if (options.onFilter) {
      if (options.onFilter(ctx.request) !== true) {
        return next();
      }
    }
    if (options.pathRewrite) {
      if (typeof options.pathRewrite === "function") {
        pathname = await options.pathRewrite(pathname, ctx.request);
      } else {
        for (const [key, value] of Object.entries(options.pathRewrite)) {
          pathname = pathname.replace(new RegExp(key), value);
        }
      }
    }
    const path = (options.prependPath || isMatch)
      ? join(options.target, pathname)
      : join(options.target, pathname.substring(key.length));
    // console.log("path", path + originUrl.search);
    // deal with proxy
    await timeoutPromise(
      dealProxy(path + originUrl.search, ctx, options),
      {
        timeoutMsg: "timeout",
        timeout: options.timeout,
      },
    );
  };
}

export function proxy(url: string): Middleware;
export function proxy(key: string, option: ProxyOptions): Middleware;
export function proxy(key: string, option?: ProxyOptions): Middleware {
  if (option) {
    return getMiddleware(key, option);
  } else {
    const url = new URL(key);
    return getMiddleware(url.pathname, { target: url.origin });
  }
}
