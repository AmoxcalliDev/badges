import { defineConfig } from 'prisma/config';

const env = process.env;

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations'
    },
    datasource: {
        url: `${env.POSTGRES_URL}`,
    },
});