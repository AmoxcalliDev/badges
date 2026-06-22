import { getStreamerInfo } from '@/utils/model/twitch';
import { BADGE_CACHE_HEADERS, SVG_CONTENT_TYPE } from '@/utils/http/cache';
import { getBadgeSvg } from '@/utils/svg/badge';

export const GET = async (_: Request, { params }: { params: Promise<{ username: string }> }) => {
    const { username } = await params;

    try {
        const { user_name } = await getStreamerInfo(username);

        const badgeSvg = getBadgeSvg('TWITCH', user_name ? 'ONLINE' : 'OFFLINE', { icon: 'simple-icons:twitch', labelCase: 'upper', rightBg: '#9146FF' });

        return new Response(badgeSvg.trim(), {
            headers: {
                ...SVG_CONTENT_TYPE,
                ...BADGE_CACHE_HEADERS,
            },
        });
    } catch {
        return new Response(getBadgeSvg('TWITCH', 'unavailable', { icon: 'simple-icons:twitch', labelCase: 'upper', rightBg: '#9146FF' }).trim(), {
            status: 200,
            headers: {
                ...SVG_CONTENT_TYPE,
                ...BADGE_CACHE_HEADERS,
            },
        });
    }
}