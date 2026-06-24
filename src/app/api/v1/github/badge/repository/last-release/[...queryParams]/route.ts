import { NextResponse } from 'next/server';

import { BADGE_CACHE_HEADERS, SVG_CONTENT_TYPE } from '@/utils/http/cache';
import { getGithubBadgeErrorText, getRepositoryReleases } from '@/utils/model/github';
import { getBadgeSvg } from '@/utils/svg/badge';

export const GET = async (_: Request, { params }: { params: Promise<{ queryParams: string[] }> }) => {
    const { queryParams } = await params;

    if (queryParams.length < 2) {
        return new NextResponse(getBadgeSvg('github', 'invalid query', { icon: 'simple-icons:github', labelCase: 'upper' }).trim(), {
            status: 400,
            headers: {
                ...SVG_CONTENT_TYPE,
                ...BADGE_CACHE_HEADERS,
            },
        });
    }

    const [username, repository] = queryParams;

    try {
        const releases = await getRepositoryReleases(username, repository);
        const releaseText = releases.length > 0 ? releases[0].tag_name : 'no releases';
        const svg = getBadgeSvg('release', releaseText, { icon: 'simple-icons:github', labelCase: 'upper' });

        return new NextResponse(svg.trim(), {
            headers: {
                ...SVG_CONTENT_TYPE,
                ...BADGE_CACHE_HEADERS,
            },
        });
    } catch (error) {
        return new NextResponse(getBadgeSvg('release', getGithubBadgeErrorText(error), { icon: 'simple-icons:github', labelCase: 'upper' }).trim(), {
            status: 200,
            headers: {
                ...SVG_CONTENT_TYPE,
                ...BADGE_CACHE_HEADERS,
            },
        });
    }
};