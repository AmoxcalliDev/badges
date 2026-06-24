import { NextResponse } from 'next/server';

import { BADGE_CACHE_HEADERS, SVG_CONTENT_TYPE } from '@/utils/http/cache';
import { getGithubBadgeErrorText, getRepositoryLicense } from '@/utils/model/github';
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
        const { spdx_id, key, name } = await getRepositoryLicense(username, repository);
        const licenseText = spdx_id && spdx_id !== 'NOASSERTION' ? spdx_id : (key ?? name ?? 'unknown');
        const svg = getBadgeSvg('license', licenseText, { icon: 'simple-icons:github', labelCase: 'upper' });

        return new NextResponse(svg.trim(), {
            headers: {
                ...SVG_CONTENT_TYPE,
                ...BADGE_CACHE_HEADERS,
            },
        });
    } catch (error) {
        return new NextResponse(getBadgeSvg('license', getGithubBadgeErrorText(error), { icon: 'simple-icons:github', labelCase: 'upper' }).trim(), {
            status: 200,
            headers: {
                ...SVG_CONTENT_TYPE,
                ...BADGE_CACHE_HEADERS,
            },
        });
    }
};