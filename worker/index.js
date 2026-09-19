const GIB = "https://gib.gov.tr/api/gibportal/mevzuat/";
const HDR = {
  "Content-Type": "application/json",
  "Accept": "application/json,text/plain,*/*",
  "Referer": "https://www.gib.gov.tr/"
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: CORS });
    }

    const url = new URL(request.url);
    // pathname = /ozelge/list?page=0&size=20 etc.
    const gibUrl = GIB + url.pathname.replace(/^\//, "") + url.search;

    try {
      const body = await request.text();
      const resp = await fetch(gibUrl, { method: "POST", headers: HDR, body });
      const text = await resp.text();
      return new Response(text, {
        status: resp.status,
        headers: { ...CORS, "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { ...CORS, "Content-Type": "application/json" }
      });
    }
  }
};
