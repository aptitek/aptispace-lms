import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { ServerRouter, type EntryContext } from "react-router";

// eslint-disable-next-line max-params
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext?: unknown,
) {
  let statusCode = responseStatusCode;
  const userAgent = request.headers.get("user-agent");
  const isBot = userAgent ? isbot(userAgent) : false;

  const stream = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        statusCode = 500;
        if (!request.signal.aborted) {
          console.error("[SSR Render Error]", error);
        }
      },
    },
  );

  if (isBot) {
    await stream.allReady;
  }

  responseHeaders.set("Content-Type", "text/html; charset=utf-8");
  return new Response(stream, {
    status: statusCode,
    headers: responseHeaders,
  });
}

export function handleError(
  error: unknown,
  { request }: { request: Request; [key: string]: unknown },
) {
  if (request.signal.aborted) {
    return;
  }

  if (error instanceof Error) {
    if (
      error.message.includes("No route matches URL") ||
      error.message.includes("getInternalRouterError")
    ) {
      console.warn(
        `[Router 404] ${error.message} - Method: ${request.method} - URL: ${request.url}`,
      );
      return;
    }
    console.error(`[Server Error] ${error.message}`, error.stack);
  } else {
    console.error("[Server Error]", error);
  }
}
