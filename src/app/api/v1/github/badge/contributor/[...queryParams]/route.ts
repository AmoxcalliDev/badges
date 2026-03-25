import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';
import { getErrorSvg } from '@/utils/svg/error';
import { getBadgeSvg } from '@/utils/svg/badge';

const { env } = process;

const octokit = new Octokit({
    auth: env.GITHUB_TOKEN,
});

export const GET = async (_: Request, { params }: { params: Promise<{ queryParams: string[] }> }) => {
    const { queryParams } = await params;

    if (queryParams.length < 2) {
        return new NextResponse(getErrorSvg('Invalid Request', 'Missing parameters'), {
            status: 400,
            headers: { 'Content-Type': 'image/svg+xml' },
        });
    }

    const [organization, username] = queryParams;

    let isContributor = false;

    try {
        const response = await octokit.rest.search.issuesAndPullRequests({
            q: `author:${username} org:${organization} type:pr is:merged`,
            per_page: 1,
        });

        isContributor = response.data.total_count > 0;
    } catch (error) {
        isContributor = false;
    }

    const statusText = isContributor ? 'Contributor' : 'Future Contributor';
    const rightBgColor = isContributor ? '#238636' : '#30363d';

    const svg = getBadgeSvg(organization, statusText, { icon: 'simple-icons:github', rightBg: rightBgColor });

    try {
        return new NextResponse(svg.trim(), {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=3600',
            },
        });
    } catch {
        return new NextResponse(getErrorSvg(organization, 'unavailable'), {
            status: 200,
            headers: { 'Content-Type': 'image/svg+xml' },
        });
    }
}
