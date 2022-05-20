// deno-lint-ignore-file no-explicit-any
export type PathRewriteFunc = (
  path: string,
  request: Request,
) => string | Promise<string>;

export interface ProxyOptions {
  target: string;
  prependPath?: boolean;
  pathRewrite?: Record<string, string> | PathRewriteFunc;
  changeOrigin?: boolean;
  headers?: Record<string, string>;
  onProxyReq?: (proxyReq: Record<string, any>, req: Request) => void;
  onProxyRes?: (
    responseBuffer: ArrayBuffer,
    proxyRes: Response,
    ctx: any,
  ) => void;
  onProxyError?: (error: Error, ctx: any) => void;
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
