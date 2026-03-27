import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';

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
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
            },
        });
    } catch (error) {
        return new NextResponse(getBadgeSvg('followers', 'unavailable', { icon: 'simple-icons:github', labelCase: 'upper' }).trim(), {
            status: 200,
            headers: { 'Content-Type': 'image/svg+xml' },
        });
    }
}