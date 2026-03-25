import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';

import { prisma } from '@/utils/adapter/prisma';

import { getSeconds } from '@/utils/time/fractions';

export const auth = betterAuth({
    appName: 'Ignite WebApp',
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    trustedOrigins: ['*'],
    rateLimit: {
        window: getSeconds({ minutes: 1 }),
        max: 100,
        storage: 'database',
        modelName: 'rateLimit',
    },
    account: {
        accountLinking: {
            enabled: true,
            allowDifferentEmails: true,
            allowUnlinkingAll: true,
        },
    },
    plugins: [
        nextCookies(),
    ],
});