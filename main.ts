// GSW HQ — serves the single-page hospitality FF&E ops app for G. Scott Waddell Co.
// Reads gsw-hq.html at cold start and returns it verbatim from Deno Deploy.
let HTML_TEXT: string | null = null;
try {
  HTML_TEXT = await Deno.readTextFile(new URL("./gsw-hq.html", import.meta.url));
} catch {
  HTML_TEXT = null;
}

Deno.serve((req: Request) => {
  const url = new URL(req.url);
  if (url.pathname === "/health") {
    return new Response(
      JSON.stringify({ ok: true, frontendEmbedded: HTML_TEXT !== null, now: new Date().toISOString() }),
      { headers: { "content-type": "application/json" } },
    );
  }
  if (!HTML_TEXT) {
    return new Response("gsw-hq.html not built into the repo yet.", { status: 500 });
  }
  return new Response(HTML_TEXT, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=60",
      "x-served-by": "gscott-deno",
    },
  });
});
