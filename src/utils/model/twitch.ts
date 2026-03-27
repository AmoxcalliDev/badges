import { expiredDate } from '@/utils/dateTime/validations';
import { prisma } from '@/utils/adapter/prisma';

const { env } = process;

const generateAccessToken = async (): Promise<string> => {
    const account = await prisma.account.findFirst({
        where: {
            accountId: 'system-twitch',
            providerId: 'twitch',
        },
        select: {
            id: true,
            accessToken: true,
            accessTokenExpiresAt: true,
        },
    });

    if (account) {
        const expired = expiredDate(`${account.accessTokenExpiresAt}`);
        if (!expired && account.accessToken) return account.accessToken;
    }

    const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: `${env.TWITCH_CLIENT_ID}`,
            client_secret: `${env.TWITCH_CLIENT_SECRET}`,
            grant_type: 'client_credentials',
        }),
    });

    const data = await response.json();

    const accessTokenExpiresAt = new Date(new Date().getTime() + (data.expires_in * 1000));

    await prisma.account.upsert({
        where: {
            id: `${account?.id || 'system-twitch'}`,
        },
        update: {
            accessToken: data.access_token,
            accessTokenExpiresAt,
        },
        create: {
            id: account?.id ?? crypto.randomUUID(),
            accountId: 'system-twitch',
            providerId: 'twitch',
            accessToken: data.access_token,
            accessTokenExpiresAt,
        },
    });

    return data.access_token;
};

export const getStreamerInfo = async (username: string) => {
    const accessToken = await generateAccessToken();

    const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${username}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Client-ID': `${env.TWITCH_CLIENT_ID}`,
        },
    });

    return (await response.json()).data?.[0] || {};
};