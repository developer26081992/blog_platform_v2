import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = process.env.POSTGRES_PRISMA_URL;
if (!connectionString) throw new Error("Set POSTGRES_PRISMA_URL in .env before seeding.");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  // Demonstration accounts only: store the hash, never the plaintext password.
  const hashedPassword = await hash("BlogDemo123!", 12);
  await prisma.$transaction(async (tx) => {
    const users = [];
    for (const [name, email] of [
      ["Alice Ndlovu", "alice@example.com"],
      ["Brian Dube", "brian@example.com"],
      ["Chipo Moyo", "chipo@example.com"],
    ]) {
      users.push(await tx.user.upsert({
        where: { email },
        update: {},
        create: { name, email, hashedPassword },
      }));
    }

    const categories = [];
    for (const name of ["Technology", "Writing"]) {
      categories.push(await tx.category.upsert({
        where: { name }, update: {}, create: { name },
      }));
    }

    const posts = [
      ["Understanding PostgreSQL", "A relational database stores data in tables. PostgreSQL uses constraints and transactions to keep related records consistent."],
      ["Getting Started with Prisma", "Prisma models describe application data and its relationships. Generated clients offer typed database queries while migrations record changes to the schema."],
      ["Why Database Migrations Matter", "Migrations capture schema changes in version control. A shared history lets developers apply the same database structure in each environment."],
      ["Protecting Account Passwords", "Store a password hash rather than the original password. A dedicated password hashing algorithm makes stolen database records harder to exploit."],
      ["Designing Useful Categories", "Categories help readers discover related stories. A many-to-many relationship lets a post cover several subjects without duplicating its content."],
      ["Writing Your First Blog Post", "Start with one clear idea and a specific reader. Use an opening paragraph to explain what the reader will learn, then support it with concrete examples."],
      ["Creating Clear Headlines", "A headline should describe the article accurately. Prefer specific words that help readers decide whether the story answers their question."],
      ["Editing Before Publication", "Review the structure first, then refine individual sentences. Check facts, links, spelling, and whether each paragraph supports the central idea."],
      ["Planning an Editorial Calendar", "List upcoming topics, responsible authors, and publication dates. Leave room for review so a deadline does not replace a quality check."],
      ["Building a Consistent Writing Habit", "Choose a realistic writing schedule and a manageable goal. Regular revision and reader feedback help turn small drafts into useful published articles."],
    ];

    for (const [index, [title, content]] of posts.entries()) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      await tx.post.upsert({
        where: { slug },
        update: {},
        create: {
          title, slug, content, published: true,
          authorId: users[index % users.length].id,
          categories: { connect: { id: categories[index < 5 ? 0 : 1].id } },
        },
      });
    }
  }, { maxWait: 30000, timeout: 30000 });

  const [users, posts, categories] = await Promise.all([
    prisma.user.count(), prisma.post.count(), prisma.category.count(),
  ]);
  console.log(`Seed complete: ${users} users, ${posts} posts, ${categories} categories.`);
}

main()
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
