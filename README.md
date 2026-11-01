# Blog Platform V2

Full stack blog examination project. Part A uses Prisma ORM and PostgreSQL hosted on Neon.

## Submission URLs

- Public GitHub repository URL: **Pending manual publication**
- Live Vercel URL: **Pending manual deployment**

Replace both pending values with the actual URLs after publishing. Deployment and live testing are not complete until these URLs exist and are checked.

## AI usage declaration

OpenAI Codex assisted with project setup, Prisma schema design, seed code, authentication routes, JWT middleware, post pages and Server Actions, tests, documentation, and development guidance. The developer must review the work and verify it before submission. Seed article text is AI-generated demonstration content.

## Local database setup

1. Install Node.js 24 LTS and run `npm ci`.
2. Copy `.env.example` to `.env` if `.env` does not exist. All required environment variables are documented in both files. Keep credentials private.
3. Set `POSTGRES_PRISMA_URL` to the pooled Neon connection string and `POSTGRES_URL_NON_POOLING` to the direct Neon connection string. Preserve Neon-provided connection parameters.
4. Run `npm run db:validate`.
5. Run `npm run db:migrate -- --name init` to generate and apply the initial migration to the development database.
6. Run `npm run db:generate` and `npm run typecheck`.
7. Run `npm run db:seed`. A new database should report 3 users, 10 posts, and 2 categories.
8. Run `npm run db:studio` to inspect the records and relationships.

The three demonstration accounts are alice@example.com, brian@example.com, and chipo@example.com. Their demonstration password is `BlogDemo123!`, stored in the database as a bcrypt hash. Re-running the seed preserves existing records and passwords and does not duplicate the seed data.

## Data model

A user writes many posts; every post has one author. Posts and categories have a many-to-many relationship. Emails, slugs, and category names are unique. Passwords are stored as bcrypt hashes. The field names `hashedPassword` and `published` correct spelling errors in the brief.

## Submission checklist

- Commit the Prisma schema, generated migration SQL, seed script, and dependency lockfile to a public GitHub repository.
- Keep this AI declaration publicly visible.
- Never commit `.env` or real credentials; publish `.env.example` as the configuration template.
- The initial migration has been applied to Neon; production builds also apply any pending migrations with `prisma migrate deploy`.
- Publish to Vercel, test the live deployment, and record the real repository and live URLs above. Keep the deployment accessible during marking.

## Official documentation

- [Prisma migrations](https://www.prisma.io/docs/cli/v7/migrate/dev)
- [Prisma seeding](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/seeding)
- [Neon connection guidance](https://neon.com/docs/connect/connect-from-any-app)

Prisma 7 runs client generation and seeding as explicit commands after migrations.

## Part B: authentication

Email/password authentication is implemented directly with bcrypt and signed JWTs. There is no third-party authentication framework. `jose` supplies JWT signing and signature verification only.

- `POST /api/auth/register`: JSON `{ "name": "Your Name", "email": "you@example.com", "password": "your-password" }`. Stores a bcrypt hash with cost factor 12 and returns the user without its password hash (201). Duplicate email returns 409; invalid input returns 400.
- `POST /api/auth/login`: JSON `{ "email": "you@example.com", "password": "your-password" }`. Verifies bcrypt and sets `blog_session`, a signed HS256 JWT, as an HttpOnly cookie. Invalid credentials return 401.
- `middleware.ts` validates the signature and expiry for `/dashboard` and every nested dashboard path, redirecting invalid sessions to `/login`. The dashboard layout also validates the session before rendering.
- Cookies last 24 hours, use `SameSite=Lax` and `Path=/`, and enable `Secure` in production (HTTPS).
- Set `JWT_SECRET` in `.env` to a random private signing key of at least 32 bytes. It is required to issue and validate JWTs. Keep the same value in the deployed environment.

Run `npm run dev`, then open `/register` or `/login` to use the forms. Seed demonstration accounts use the password documented above.

To verify Part B, run `npm run build`, then `npm start` and, in another terminal, `npm run test:auth`. This integration test uses the configured database, creates and removes one temporary account, and checks registration, bcrypt cost 12, duplicate emails, login, cookie attributes, and rejection of absent, expired, and tampered JWTs. The test expects a production server at `http://localhost:3000`.

- [Next.js route handlers and middleware](https://nextjs.org/docs/15/app/getting-started/route-handlers-and-middleware)
- [jose JWT library](https://github.com/panva/jose)

## Part C: posts and dynamic routes

- `/`: lists published posts only.
- `/blog/[slug]`: published article with author name and categories; drafts and unknown slugs return not found.
- `/dashboard`: links to the post manager.
- `/dashboard/posts`: table of the authenticated author's posts, including drafts.
- `/dashboard/posts/new`: create a draft with title, unique slug, content, and categories.
- `/dashboard/posts/[id]/edit`: edit an owned post.

All post mutations use Server Actions in `app/dashboard/posts/actions.ts`, with server-side Zod validation. The table provides publish/unpublish and delete actions. Actions authenticate the session and enforce ownership in database mutations. Publication changes immediately refresh the public list and article routes. Updating a slug invalidates both the old and new article paths. Form errors display without discarding the entered content.

The Part C brief names five pages and says six routes; the existing `/dashboard` is included above as the sixth route.

Part C verification: production build and TypeScript checks passed. Browser tests against Neon exercised the actual rendered Server Action forms for draft creation, public draft exclusion, publication, article author/category display, editing, slug changes, duplicate-slug validation, unpublication, and deletion. A second test author could not read the first author's edit page or update, publish, or delete their post. The hydrated create form preserved input after a server-side category validation error. Temporary test records were removed afterward.

- [Next.js Server Actions and forms](https://nextjs.org/docs/app/guides/forms)
- [Zod validation](https://zod.dev/basics)

## Part D: Vercel and public repository

### Environment variables

All three variables must be set locally in `.env` and in the Vercel project's Production environment. Set them in Preview as well if you deploy previews. They are server secrets, so do not use the `NEXT_PUBLIC_` prefix.

| Variable | Purpose |
| --- | --- |
| `POSTGRES_PRISMA_URL` | Neon pooled PostgreSQL connection string for application queries and seeding. |
| `POSTGRES_URL_NON_POOLING` | Neon direct PostgreSQL connection string for Prisma migrations. |
| `JWT_SECRET` | Private random signing key of at least 32 bytes for authentication cookies. |

Use the values from the local `.env`, which has been updated to the required names. `.env.example` documents the same variables using placeholders. Never upload `.env` to the public repository.

### Publish manually to GitHub

1. Create an empty **public** repository on GitHub called `blog-platform-v2`. Do not initialize it with a README or license because this project already contains files.
2. From this project folder, add your repository URL and push the existing local commit:

   ```sh
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/blog-platform-v2.git
   git push -u origin main
   ```

3. Check the repository is accessible while signed out. Confirm it contains `prisma/schema.prisma`, the migration SQL, `prisma/seed.ts`, `package-lock.json`, and this README with its public AI declaration.

### Deploy manually to Vercel

1. Sign in to Vercel, choose **Add New > Project**, and import the public GitHub repository.
2. Select the Next.js framework preset and Node.js 24.x. Keep the repository root as the project root.
3. Add the three environment variables above before deploying. Copy their values from `.env`; do not copy the surrounding quotation marks.
4. Use `npm ci` as Install Command and `npm run build` as Build Command. These settings are also declared in `vercel.json`.
5. Deploy. The build runs `prisma generate && prisma migrate deploy && next build`. Check the build log confirms migrations succeeded.
6. Open the production URL without signing in to Vercel. If deployment protection blocks examiners, configure the production deployment for public access in the Vercel project settings.
7. Replace both pending URLs at the top of this README, commit the README update, and push it:

   ```sh
   git add README.md
   git commit -m "docs: record public repository and live deployment URLs"
   git push
   ```

### Test before submission

- Visit `/` and a published `/blog/[slug]`; verify the author and categories appear.
- Visit `/dashboard/posts` while signed out; it should redirect to `/login`.
- Register a test account and log in. Confirm the `blog_session` cookie is HttpOnly and Secure on the HTTPS deployment.
- Create a draft and confirm it stays hidden publicly. Publish it, edit it, unpublish it, and delete it using the dashboard.
- Verify another author cannot access or change the test author's posts.
- Check both recorded URLs again while signed out. Keep Neon and the production deployment available for marking.

For a local production run, use `npm run build` followed by `npm start`. The build requires an active Neon connection because it applies migrations. `npm run dev` starts local development.

The flash-drive copy has been skipped at the developer's request; it remains an exam submission requirement if still applicable.

- [Prisma deployment to Vercel](https://www.prisma.io/docs/orm/v7/prisma-client/deployment/serverless/deploy-to-vercel)
- [Vercel build configuration](https://vercel.com/docs/builds/configure-a-build)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
