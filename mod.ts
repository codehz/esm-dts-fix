/// <reference path="./deploy.d.ts" />

import mapped from "./mapped.ts";

const encoder = new TextEncoder();

addEventListener("fetch", async (event) => {
  const url = new URL(event.request.url);
  const dts = url.searchParams.get("dts");
  if (!dts) {
    const origin = url.pathname.startsWith("/_/")
      ? new URL(url.pathname.substr(11), "https://cdn.esm.sh/")
      : new URL(url.pathname, "https://esm.sh/");
    origin.search = url.search;
    const res = await fetch(origin, {
      headers: {
        "User-Agent": "Deno/fix-dts",
      },
    });
    if (res.status != 200) {
      event.respondWith(
        new Response(res.body, {
          status: res.status,
          headers: {
            ...Object.fromEntries(res.headers.entries()),
            "x-origin-url": event.request.url,
            "x-requested-url": origin.toString(),
          },
        }),
      );
      return;
    }
    let dts = res.headers.get("x-typescript-types") ?? undefined;
    let text = await res.text();
    for (const [key, value] of mapped) {
      text = text.replaceAll(key, value);
      dts = dts?.replace(key, value);
    }
    text = text.replaceAll("^^HOST^^", url.host);
    dts = dts?.replace("^^HOST^^", url.host);
    const encoded = encoder.encode(text);
    event.respondWith(
      new Response(encoded, {
        status: 200,
        headers: {
          ...Object.fromEntries(res.headers.entries()),
          "x-origin-url": event.request.url,
          "x-requested-url": origin.toString(),
          "content-length": encoded.length + "",
          "x-typescript-types": dts as string,
        },
      }),
    );
  } else {
    url.searchParams.delete("dts");
    const origin = new URL(url.pathname, "https://esm.sh/");
    origin.search = url.search;
    console.log(origin + "");
    const res = await fetch(origin, {
      headers: {
        "User-Agent": "Deno/fix-dts",
      },
    });
    event.respondWith(
      new Response(res.body, {
        status: res.status,
        headers: {
          ...Object.fromEntries(res.headers.entries()),
          "x-typescript-types": dts,
        },
      }),
    );
  }
});
