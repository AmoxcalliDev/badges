import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';
import { formatCompactNumber } from '@/utils/numbers/compact';
import { getErrorSvg } from '@/utils/svg/error';
import { getBadgeSvg } from '@/utils/svg/badge';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

export const GET = async (_: Request, { params }: { params: Promise<{ username: string }> }) => {
    const { username } = await params;

    try {
        // 1. Fetch con Octokit — tipado completo y rate limit manejado automáticamente
        const { data } = await octokit.rest.users.getByUsername({ username });
        const followers = formatCompactNumber(data.followers);

        // 2. SVG — flat, dimensiones automáticas
        const svg = getBadgeSvg('followers', followers, { icon: 'simple-icons:github', labelCase: 'upper' });

        // 3. Retorno con Headers agresivos para la CDN
        return new NextResponse(svg.trim(), {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
            },
        });
    } catch (error) {
        return new NextResponse(getErrorSvg('FOLLOWERS', 'unavailable'), {
            status: 200,
            headers: { 'Content-Type': 'image/svg+xml' },
        });
    }
}