import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';

import { BADGE_CACHE_HEADERS, SVG_CONTENT_TYPE } from '@/utils/http/cache';
import { formatCompactNumber } from '@/utils/numbers/compact';
import { getBadgeSvg } from '@/utils/svg/badge';

const authedOctokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

const publicOctokit = new Octokit();

const withOctokitFallback = async <T>(request: (client: Octokit) => Promise<T>) => {
    try {
        return await request(authedOctokit);
    } catch (error) {
        const status = (error as { status?: number })?.status;
        const message = (error as { message?: string })?.message?.toLowerCase();
        const shouldRetryWithoutToken = status === 401 || message?.includes('bad credentials');

        if (!shouldRetryWithoutToken) throw error;

        return request(publicOctokit);
    }
};

const isBotUser = (login: string, type?: string) => {
    if (type?.toLowerCase() === 'bot') return true;

    const normalizedLogin = login.toLowerCase();

    return normalizedLogin.endsWith('[bot]');
};

const getMergedPrContributorsCount = async (organization: string) => {
    const contributors = new Set<string>();
    const perPage = 100;
    const maxPages = 5;

    for (let page = 1; page <= maxPages; page++) {
        const { data } = await withOctokitFallback(client => client.rest.search.issuesAndPullRequests({
            q: `org:${organization} type:pr is:merged`,
            per_page: perPage,
            page,
        }));

        for (const item of data.items) {
            const login = item.user?.login;
            const type = item.user?.type;

            if (login && !isBotUser(login, type)) contributors.add(login.toLowerCase());
        }

        if (data.items.length < perPage || page * perPage >= data.total_count) {
            break;
        }
    }

    return contributors.size;
};

const getErrorBadgeText = (error: unknown) => {
    const status = (error as { status?: number })?.status;
    const message = (error as { message?: string })?.message?.toLowerCase();

    if (status === 403 || status === 429) return 'rate limited';
    if (status === 404) return 'org not found';
    if (status === 422) return 'invalid org';
    if (message?.includes('bad credentials')) return 'bad token';
    if (message?.includes('fetch failed')) return 'network error';

    return 'unavailable';
};

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
        return new NextResponse(getBadgeSvg('contributors', getErrorBadgeText(searchError), { icon: 'simple-icons:github', labelCase: 'upper' }).trim(), {
            status: 200,
            headers: {
                ...SVG_CONTENT_TYPE,
                ...BADGE_CACHE_HEADERS,
            },
        });
    }
};