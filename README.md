This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, set up MongoDB (see [Database Setup](#database-setup) below), then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Setup

Books are stored in MongoDB using Mongoose. You need a running MongoDB instance and a connection string:

1. **Get a MongoDB instance** (pick one):
   - **MongoDB Atlas (free cloud)**: create a cluster at https://www.mongodb.com/atlas, add your IP to the network access list, create a database user, and copy the connection string from *Connect → Drivers* (it looks like `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/personal_library`).
   - **Local MongoDB**: install MongoDB Community and it will run at `mongodb://127.0.0.1:27017`.
   - **Docker**: `docker run --name library-mongo -p 27017:27017 -d mongo`

2. **Configure the connection string**:

```bash
cp .env.local.example .env.local
```

   Then edit `.env.local` and set `MONGODB_URI` to your real connection string.

3. **Seed the sample books** (migrates the curated collection from `data/books.ts` into the database; safe to re-run — it upserts by book id):

```bash
npm run db:seed
```

User-uploaded PDF books are saved to the database through `POST /api/books`; the PDF files themselves are stored under `public/uploads`.

If the database is unreachable, the app falls back to the local sample collection so the UI still renders.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
