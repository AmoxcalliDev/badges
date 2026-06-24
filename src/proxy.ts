import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { BADGE_CACHE_HEADERS } from '@/utils/http/cache';

export function proxy(request: NextRequest) {
    if (!request.nextUrl.pathname.includes('/badge/')) {
        return NextResponse.next();
    }

    const response = NextResponse.next();

    for (const [header, value] of Object.entries(BADGE_CACHE_HEADERS)) {
        response.headers.set(header, value);
    }

    return response;
}

export const config = {
    matcher: ['/api/:path*'],
};