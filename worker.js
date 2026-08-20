export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const assetResponse = await env.ASSETS.fetch(request);
    const response = new Response(assetResponse.body, assetResponse);

    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

    // Fingerprint-free static assets: cache hard. HTML stays revalidated so
    // content edits go live on the next request rather than a year from now.
    if (/\.(png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|otf|css|js|mp4|webm)$/i.test(url.pathname)) {
      response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    }

    return response;
  },
};
