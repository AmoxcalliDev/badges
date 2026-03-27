import { getStreamerInfo } from '@/utils/model/twitch';
import { getBadgeSvg } from '@/utils/svg/badge';

export const GET = async (_: Request, { params }: { params: Promise<{ username: string }> }) => {
    const { username } = await params;

    try {
        const { user_name } = await getStreamerInfo(username);

        const badgeSvg = getBadgeSvg('TWITCH', user_name ? 'ONLINE' : 'OFFLINE', { icon: 'simple-icons:twitch', labelCase: 'upper', rightBg: '#9146FF' });

        return new Response(badgeSvg.trim(), {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=3600',
            },
        });
    } catch (error) {
        return new Response(getBadgeSvg('TWITCH', 'unavailable', { icon: 'simple-icons:twitch', labelCase: 'upper', rightBg: '#9146FF' }).trim(), {
            status: 200,
            headers: { 'Content-Type': 'image/svg+xml' },
        });
    }
}