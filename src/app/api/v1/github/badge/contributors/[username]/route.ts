import { NextResponse } from 'next/server';

import { BADGE_CACHE_HEADERS, SVG_CONTENT_TYPE } from '@/utils/http/cache';
import { getMergedPrContributorsCount, getGithubBadgeErrorText } from '@/utils/model/github';
import { formatCompactNumber } from '@/utils/numbers/compact';
import { getBadgeSvg } from '@/utils/svg/badge';

export const GET = async (_: Request, { params }: { params: Promise<{ username: string }> }) => {
    const { username } = await params;
    const normalizedOrganization = username?.trim();

    if (!normalizedOrganization) {
        return new NextResponse(getBadgeSvg('github', 'invalid query', { icon: 'simple-icons:github', labelCase: 'upper' }).trim(), {
            status: 400,
            headers: {
                ...SVG_CONTENT_TYPE,
                ...BADGE_CACHE_HEADERS,
            },
        });
    }

    try {
        const contributorsCount = await getMergedPrContributorsCount(normalizedOrganization);
        const contributors = formatCompactNumber(contributorsCount);

        const svg = getBadgeSvg('contributors', contributors, { icon: 'simple-icons:github', labelCase: 'upper' });

        return new NextResponse(svg.trim(), {
            headers: {
                ...SVG_CONTENT_TYPE,
                ...BADGE_CACHE_HEADERS,
            },
        });
    } catch (searchError) {
        return new NextResponse(getBadgeSvg('contributors', getGithubBadgeErrorText(searchError), { icon: 'simple-icons:github', labelCase: 'upper' }).trim(), {
            status: 200,
            headers: {
                ...SVG_CONTENT_TYPE,
                ...BADGE_CACHE_HEADERS,
            },
        });
    }
};