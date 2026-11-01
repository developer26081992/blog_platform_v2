# The Journal

A full stack publishing platform for readers and independent authors. Discover published stories, create an account, and manage drafts and articles from a personal workspace.

- **Live application:** https://blog-platform-v2-omega.vercel.app
- **Source repository:** https://github.com/developer26081992/blog_platform_v2

## Features

- Responsive editorial interface with article listings, featured stories, and readable article pages.
- Email/password registration and login using bcrypt with cost factor 12.
- Signed JWT sessions stored in HttpOnly cookies, with Secure cookies over HTTPS in production.
- Protected author workspace with a table of the signed-in author's posts.
- Draft creation, editing, publishing, unpublishing, and deletion using Server Actions with Zod validation.
- Ownership checks on post mutations and edit pages.
- PostgreSQL persistence, versioned Prisma migrations, and an optional development seed.

## Technology

Next.js 15 App Router, React 19, TypeScript, Prisma ORM 7, PostgreSQL on Neon, bcryptjs, jose, Zod, and Vercel. Styling uses shared CSS and system fonts without external font dependencies.

## Local setup

Prerequisites: Node.js 24.x, npm, and a Neon or local PostgreSQL database.

1. Clone the repository and install the locked dependencies:

   ```sh
   git clone https://github.com/developer26081992/blog_platform_v2.git
   cd blog_platform_v2
   npm ci
   ```

2. Copy `.env.example` to `.env` and replace its placeholders with your own connection strings and JWT signing key. Use `Copy-Item .env.example .env` in PowerShell or `cp .env.example .env` on macOS/Linux.
3. Validate the schema, apply the existing migrations to your development database, and generate the Prisma client:

   ```sh
   npm run db:validate
   npm run db:migrate
   npm run db:generate
   ```

4. Start the development server:

   ```sh
   npm run dev
   ```

5. Open http://localhost:3000 and register an account.

To run a local production build, use `npm run build` followed by `npm start`. The build requires database access because it applies pending migrations.

## Environment variables

Set these variables in `.env` locally and in the Vercel project's Production environment. Configure Preview separately when using preview deployments. `.env.example` contains placeholders; private `.env` files are excluded from Git.

| Variable | Purpose |
| --- | --- |
| `POSTGRES_PRISMA_URL` | Neon pooled PostgreSQL connection string for application queries and seeding. |
| `POSTGRES_URL_NON_POOLING` | Direct PostgreSQL connection string used by Prisma migrations. |
| `JWT_SECRET` | Private random signing key of at least 32 bytes for authentication sessions. |

Preserve the connection parameters supplied by Neon. These variables are server secrets and must not use the `NEXT_PUBLIC_` prefix. Use separate databases and signing keys for development and production. Never commit real credentials.

## Database

`prisma/schema.prisma` defines users, posts, and categories. A user has many posts, each post belongs to one author, and posts and categories have a many-to-many relationship. Emails, slugs, and category names are unique. Passwords are stored as bcrypt hashes.

Migration SQL is versioned under `prisma/migrations`. Use `npm run db:migrate` during development and `npm run db:deploy` to apply committed migrations in production. The deployment build also runs `prisma migrate deploy`.

### Development seed

For a development database, run `npm run db:seed` to create three demonstration users, ten published posts, and two categories: Technology and Writing. This is optional sample data, not part of the deployment build.

The demonstration users are `alice@example.com`, `brian@example.com`, and `chipo@example.com`, with the development password `BlogDemo123!`. Re-running the seed preserves existing records and passwords without duplicating seed data. Use these publicly documented accounts only for development; remove or secure any demonstration accounts before using a database for real users.

## Routes and authentication

| Route | Purpose |
| --- | --- |
| `/` | Published stories and the featured article. |
| `/blog/[slug]` | Published article with author and categories. Draft and unknown slugs return 404. |
| `/register` | Account registration. |
| `/login` | Email/password login. |
| `/dashboard` | Author workspace overview. |
| `/dashboard/posts` | The authenticated author's posts and publishing controls. |
| `/dashboard/posts/new` | Create a draft. |
| `/dashboard/posts/[id]/edit` | Edit an owned post. |

`POST /api/auth/register` accepts JSON with `name`, `email`, and `password`. It stores a bcrypt hash and returns public user fields with status 201. Duplicate emails return 409 and invalid inputs return 400.

`POST /api/auth/login` accepts JSON with `email` and `password`. Valid credentials set the `blog_session` cookie; invalid credentials return 401. Sessions use signed HS256 JWTs with a 24-hour expiry. Cookies use HttpOnly, SameSite=Lax, Path=/, and Secure in production.

`middleware.ts` validates JWT signatures and expiry for all dashboard paths. Dashboard pages and post actions also verify authentication. Every post mutation enforces ownership. Password hashes and JWTs are not returned in authentication response bodies.

Post mutations live in `app/dashboard/posts/actions.ts`. They validate input with Zod and refresh affected article and listing routes after changes. Forms preserve entered values when validation fails.

## Deployment

The application is hosted on Vercel and connected to the GitHub repository. Pushes to `main` trigger production deployments.

For a new deployment:

1. Import the repository into Vercel using the Next.js framework preset and Node.js 24.x.
2. Set the three environment variables above before building. Enter values without surrounding quotation marks.
3. Use `npm ci` as the install command and `npm run build` as the build command, as declared in `vercel.json`.
4. Confirm the build and migrations succeed, then check the production domain and public access settings.

The build command is:

```sh
prisma generate && prisma migrate deploy && next build
```

Seeding is explicit and is not run during deployment. Update the live application link in this document if the production domain changes.

## Validation

```sh
npm run typecheck
npm run build
npm start
```

With a local production server running, use `npm run test:auth` in another terminal. The integration test creates and removes a temporary account and checks registration, bcrypt cost 12, duplicate emails, login, cookie attributes, dashboard protection, and rejection of expired or tampered JWTs.

To target the deployed app, run:

```sh
npm run test:auth -- https://blog-platform-v2-omega.vercel.app
```

The test's local environment must match the target application's database and JWT signing key. It writes temporary data to that database.

Before releasing changes, also check article rendering, draft privacy, the full post editing and publishing workflow, and ownership enforcement with separate users. The editorial layout has been reviewed at desktop, tablet, and mobile widths, including contained table scrolling and forms without page overflow.

## AI disclosure

OpenAI Codex assisted with project setup, database modeling, seed content, authentication, post pages and Server Actions, interface design and styling, tests, and documentation. Seed article text is AI-generated demonstration content.

## Documentation

- [Next.js App Router](https://nextjs.org/docs/15/app)
- [React](https://react.dev/)
- [Prisma migrations](https://www.prisma.io/docs/cli/v7/migrate/dev)
- [Prisma deployment to Vercel](https://www.prisma.io/docs/orm/v7/prisma-client/deployment/serverless/deploy-to-vercel)
- [Neon connections](https://neon.com/docs/connect/connect-from-any-app)
- [jose](https://github.com/panva/jose)
- [Zod](https://zod.dev/basics)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
