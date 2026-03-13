import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';
import { getBadgeIcon } from '@/utils/icons/iconHelper';
import { getErrorSvg } from '@/utils/svg/error';

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

    // * GitHub icon in white (force color since currentColor doesn't always inherit in nested SVGs)
    const iconSize = 14;
    const rawIcon = getBadgeIcon('simple-icons:github', '#ffffff', iconSize);
    const iconSvg = rawIcon.replace(/currentColor/g, '#ffffff');

    const statusText = isContributor ? 'Contributor' : 'Future Contributor';
    const rightBgColor = isContributor ? '#238636' : '#30363d';

    const height = 28;
    const iconPad = 6;
    const iconTextGap = 4;
    const labelPadRight = 6;

    // * Dynamic width for organization name in Verdana 11px ≈ 7px/char, with a minimum of 30px to avoid too narrow badges for short names
    const orgTextWidth = Math.max(organization.length * 7, 30);
    const leftWidth = iconPad + iconSize + iconTextGap + orgTextWidth + labelPadRight;

    const valuePad = 10;
    const statusTextWidth = Math.max(statusText.length * 7, 50);
    const rightWidth = valuePad + statusTextWidth + valuePad;
    const totalWidth = leftWidth + rightWidth;

    const labelTextX = iconPad + iconSize + iconTextGap + Math.round(orgTextWidth / 2);
    const valueTextX = leftWidth + Math.round(rightWidth / 2);
    const iconY = Math.round((height - iconSize) / 2);
    const textY = Math.round(height / 2) + 4;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" role="img" aria-label="${organization}: ${statusText}">
        <title>${organization}: ${statusText}</title>
        <rect width="${leftWidth}" height="${height}" fill="#555"/>
        <rect x="${leftWidth}" width="${rightWidth}" height="${height}" fill="${rightBgColor}"/>
        <g transform="translate(${iconPad}, ${iconY})">
            ${iconSvg}
        </g>
        <g fill="#fff" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11" text-anchor="middle">
            <text x="${labelTextX}" y="${textY - 1}" fill="#010101" fill-opacity=".3">${organization}</text>
            <text x="${labelTextX}" y="${textY}">${organization}</text>
            <text x="${valueTextX}" y="${textY - 1}" fill="#010101" fill-opacity=".3" font-weight="bold">${statusText}</text>
            <text x="${valueTextX}" y="${textY}" font-weight="bold">${statusText}</text>
        </g>
    </svg>`;

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
