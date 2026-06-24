import { Octokit } from 'octokit';

const octokit = new Octokit();

const isBotUser = (login: string, type?: string) => {
    if (type?.toLowerCase() === 'bot') return true;

    return login.toLowerCase().endsWith('[bot]');
};

export const hasMergedPrContribution = async (organization: string, username: string) => {
    const response = await octokit.rest.search.issuesAndPullRequests({
        q: `author:${username} org:${organization} type:pr is:merged`,
        per_page: 1,
    });

    return response.data.total_count > 0;
};

export const getUserFollowersCount = async (username: string) => {
    const { data } = await octokit.rest.users.getByUsername({ username });

    return data.followers;
};

export const getRepositoryLicense = async (owner: string, repo: string) => {
    const { data } = await octokit.rest.repos.get({
        owner,
        repo,
    });

    return { ...data.license };
};

export const getRepositoryReleases = async (owner: string, repo: string) => {
    const { data } = await octokit.rest.repos.listReleases({
        owner,
        repo,
    });

    return data;
};

export const getMergedPrContributorsCount = async (organization: string) => {
    const contributors = new Set<string>();
    const perPage = 100;
    const maxPages = 5;

    for (let page = 1; page <= maxPages; page++) {
        const { data } = await octokit.rest.search.issuesAndPullRequests({
            q: `org:${organization} type:pr is:merged`,
            per_page: perPage,
            page,
        });

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

export const getGithubBadgeErrorText = (error: unknown) => {
    const status = (error as { status?: number })?.status;
    const message = (error as { message?: string })?.message?.toLowerCase();

    if (status === 403 || status === 429) return 'rate limited';
    if (status === 404) return 'org not found';
    if (status === 422) return 'invalid org';
    if (message?.includes('bad credentials')) return 'bad token';
    if (message?.includes('fetch failed')) return 'network error';

    return 'unavailable';
};
