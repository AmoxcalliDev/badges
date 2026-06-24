export const BADGE_CACHE_HEADERS = {
    'Cache-Control': 'public, max-age=300, s-maxage=7200, stale-while-revalidate=86400, stale-if-error=86400',
    'CDN-Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=86400, stale-if-error=86400',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=86400, stale-if-error=86400',
};

export const SVG_CONTENT_TYPE = {
    'Content-Type': 'image/svg+xml'
};