/**
 * Cloudflare Worker Reverse Proxy (אופציונלי - לאיחוד סמכות דומיין תחת דומיין אחד)
 * מאפשר להגיש את כל אתרי הקורסים תחת תתי-נתיבים של הדומיין הראשי,
 * תוך שמירה על פעולתם התקינה של אתרי ה-pages.dev הקיימים.
 */
const COURSE_ROUTES = {
  "operating-systems": "https://operating-system-5l3.pages.dev",
  "programming-languages": "https://summary-of-programming-languages.pages.dev",
  "computational-models": "https://computational-models.pages.dev",
  "cybersecurity": "https://introduction-to-cybersecurity.pages.dev",
  "artificial-intelligence": "https://introduction-to-artificial-intelligence.pages.dev",
  "communication-networks": "https://communication-networks.pages.dev",
  "object-oriented-programming": "https://object-oriented-programming.pages.dev",
  "infi-1": "https://infi-1.pages.dev",
  "infi-2": "https://infi2-9rg.pages.dev",
  "infi2": "https://infi2-9rg.pages.dev",
  "linear-1": "https://linear1.pages.dev",
  "linear1": "https://linear1.pages.dev"
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const segments = url.pathname.split('/').filter(Boolean);

    if (segments.length > 0 && COURSE_ROUTES[segments[0]]) {
      const targetOrigin = COURSE_ROUTES[segments[0]];
      const restPath = '/' + segments.slice(1).join('/');
      const targetUrl = targetOrigin + (restPath === '/' ? '/' : restPath) + url.search;
      
      const response = await fetch(targetUrl, request);
      const newHeaders = new Headers(response.headers);
      newHeaders.set('X-Robots-Tag', 'index, follow');
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
    }

    return fetch(request);
  }
};
