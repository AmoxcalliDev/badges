import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';

import { BADGE_CACHE_HEADERS, SVG_CONTENT_TYPE } from '@/utils/http/cache';
import { formatCompactNumber } from '@/utils/numbers/compact';
import { getBadgeSvg } from '@/utils/svg/badge';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

export const GET = async (_: Request, { params }: { params: Promise<{ username: string }> }) => {
    const { username } = await params;

    try {
        const { data } = await octokit.rest.users.getByUsername({ username });
        const followers = formatCompactNumber(data.followers);

        const svg = getBadgeSvg('followers', followers, { icon: 'simple-icons:github', labelCase: 'upper' });

        return new NextResponse(svg.trim(), {
            headers: {
                'Content-Type': SVG_CONTENT_TYPE,
                ...BADGE_CACHE_HEADERS,
            },
        });
    } catch {
        return new NextResponse(getBadgeSvg('followers', 'unavailable', { icon: 'simple-icons:github', labelCase: 'upper' }).trim(), {
            status: 200,
            headers: {
                'Content-Type': SVG_CONTENT_TYPE,
                ...BADGE_CACHE_HEADERS,
            },
        });
    }
}