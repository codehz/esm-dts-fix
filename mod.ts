/// <reference path="./deploy.d.ts" />

addEventListener("fetch", async (event) => {
  const url = new URL(event.request.url);
  const dts = url.searchParams.get("dts");
  if (!dts) {
    event.respondWith(new Response(null, { status: 403 }));
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
