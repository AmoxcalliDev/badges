import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';
import { getBadgeIcon } from '@/utils/icons/iconHelper';
import { formatCompactNumber } from '@/utils/numbers/compact';
import { getErrorSvg } from '@/utils/svg/error';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

export const GET = async (_: Request, { params }: { params: Promise<{ username: string }> }) => {
    const { username } = await params;

    try {
        // 1. Fetch con Octokit — tipado completo y rate limit manejado automáticamente
        const { data } = await octokit.rest.users.getByUsername({ username });
        const followers = formatCompactNumber(data.followers);

        // 2. Logo de GitHub — forzamos blanco en todos los paths (currentColor no siempre hereda en SVG anidado)
        const iconSize = 14;
        const iconSvg = getBadgeIcon('simple-icons:github', '#ffffff', iconSize);

        // 3. Dimensiones — paneles, texto y número bien proporcionados
        const height = 28;
        const iconPad = 6;
        const iconTextGap = 4;
        const labelText = 'FOLLOWERS';
        // "followers" en Verdana 11px lowercase ≈ 49px
        const labelTextWidth = 75;
        const labelPadRight = 6;
        const leftWidth = iconPad + iconSize + iconTextGap + labelTextWidth + labelPadRight;

        const valuePad = 8;
        const valueTextWidth = Math.max(followers.length * 7, 16);
        const rightWidth = valuePad + valueTextWidth + valuePad;
        const totalWidth = leftWidth + rightWidth;

        const labelTextX = iconPad + iconSize + iconTextGap + Math.round(labelTextWidth / 2);
        const valueTextX = leftWidth + Math.round(rightWidth / 2);
        const iconY = Math.round((height - iconSize) / 2);
        const textY = Math.round(height / 2) + 4;

        // 4. SVG — flat puro, esquinas cuadradas
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" role="img" aria-label="GitHub followers: ${followers}">
            <title>GitHub followers: ${followers}</title>
            <rect width="${leftWidth}" height="${height}" fill="#555"/>
            <rect x="${leftWidth}" width="${rightWidth}" height="${height}" fill="#238636"/>
            <g transform="translate(${iconPad}, ${iconY})">
                ${iconSvg}
            </g>
            <g fill="#fff" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11" text-anchor="middle">
                <text x="${labelTextX}" y="${textY - 1}" fill="#010101" fill-opacity=".3">${labelText}</text>
                <text x="${labelTextX}" y="${textY}">${labelText}</text>
                <text x="${valueTextX}" y="${textY - 1}" fill="#010101" fill-opacity=".3" font-weight="bold">${followers}</text>
                <text x="${valueTextX}" y="${textY}" font-weight="bold">${followers}</text>
            </g>
        </svg>`;

        // 5. Retorno con Headers agresivos para la CDN
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