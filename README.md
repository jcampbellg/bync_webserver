This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, fill in the `.env` file with the following content:

```
process.env.TZ = UTC
NODE_ENV = production
DATABASE_URL = postgres://...
OPEN_AI_KEY = sk-...
TOKEN = ...
```

Run `yarn knex-latest` to create the database schema.