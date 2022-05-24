// deno-lint-ignore-file no-explicit-any
export type PathRewriteFunc = (
  path: string,
  request: Request,
) => string | Promise<string>;

export type ProxyReq = {
  headers: Headers;
  body: any;
  method: string;
  signal: AbortSignal;
};

export interface ProxyOptions {
  target: string;
  prependPath?: boolean;
  pathRewrite?: Record<string, string> | PathRewriteFunc;
  changeOrigin?: boolean;
  headers?: Record<string, string>;
  /**
   * filter whether to deal by proxy
   * @return only allow returned true to proxy
   */
  onFilter?: (req: Request) => boolean | Promise<boolean>;
  onProxyReq?: (proxyReq: ProxyReq, req: Request) => void;
  onProxyRes?: (
    responseBuffer: ArrayBuffer,
    proxyRes: Response,
    ctx: Context,
  ) => void;
  onProxyError?: (error: Error, ctx: Context) => void;
  proxyTimeout?: number;
  timeout?: number;
}

export interface Context {
  request: Request;
  response: Response;
}

export interface Request {
  headers: Headers;
  [x: string]: any;
}

export interface Response {
  headers: Headers;
  [x: string]: any;
}

export type Next = () => Promise<unknown>;

export type Middleware = (
  ctx: Context,
  next: Next,
) => Promise<unknown>;
