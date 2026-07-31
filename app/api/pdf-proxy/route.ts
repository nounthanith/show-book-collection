import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const ALLOWED_HOSTS = new Set([
  "pub-a9da2ecf32e7451da353a2c142dc9491.r2.dev",
  "www.gutenberg.org",
  "gutenberg.org",
  "www.w3.org",
]);

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return new Response("Missing url query parameter.", { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return new Response("Invalid url query parameter.", { status: 400 });
  }

  if (target.protocol !== "https:") {
    return new Response("Only HTTPS URLs are allowed.", { status: 400 });
  }

  if (!ALLOWED_HOSTS.has(target.hostname)) {
    return new Response("URL host is not allowed.", { status: 403 });
  }

  const range = request.headers.get("range");
  const upstream = await fetch(target.toString(), {
    headers: range ? { Range: range } : {},
  });

  if (!upstream.ok && upstream.status !== 206) {
    return new Response("Failed to fetch the PDF from the upstream host.", {
      status: 502,
    });
  }

  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("content-length", contentLength);

  const contentRange = upstream.headers.get("content-range");
  if (contentRange) headers.set("content-range", contentRange);

  const acceptRanges = upstream.headers.get("accept-ranges");
  if (acceptRanges) headers.set("accept-ranges", acceptRanges);

  headers.set("access-control-allow-origin", "*");
  headers.set("cache-control", "public, max-age=31536000, immutable");

  return new Response(upstream.body, { status: upstream.status, headers });
}
