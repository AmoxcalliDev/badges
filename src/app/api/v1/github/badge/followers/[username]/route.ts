import { NextResponse } from 'next/server';

import { BADGE_CACHE_HEADERS, SVG_CONTENT_TYPE } from '@/utils/http/cache';
import { getUserFollowersCount } from '@/utils/model/github';
import { formatCompactNumber } from '@/utils/numbers/compact';
import { getBadgeSvg } from '@/utils/svg/badge';

export const GET = async (_: Request, { params }: { params: Promise<{ username: string }> }) => {
    const { username } = await params;

    try {
        const followersCount = await getUserFollowersCount(username);
        const followers = formatCompactNumber(followersCount);

        const svg = getBadgeSvg('followers', followers, { icon: 'simple-icons:github', labelCase: 'upper' });

        return new NextResponse(svg.trim(), {
            headers: {
                ...SVG_CONTENT_TYPE,
                ...BADGE_CACHE_HEADERS,
            },
        });
    } catch {
        return new NextResponse(getBadgeSvg('followers', 'unavailable', { icon: 'simple-icons:github', labelCase: 'upper' }).trim(), {
            status: 200,
            headers: {
                ...SVG_CONTENT_TYPE,
                ...BADGE_CACHE_HEADERS,
            },
        });
    }
};