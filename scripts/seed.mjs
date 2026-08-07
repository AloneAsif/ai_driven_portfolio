/**
 * Seeds the Sanity `production` dataset with placeholder content so the site
 * has something to display. Safe to run more than once — documents use stable
 * ids and are overwritten (image assets accumulate, which is harmless).
 *
 * Run with:
 *   npm run seed
 * (reads env from .env.local, requires a token with write access)
 */
import { createClient } from "@sanity/client";
import { deflateSync } from "node:zlib";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-01";
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_READ_TOKEN in .env.local",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

// ---------------------------------------------------------------------------
// Minimal solid-colour PNG generator (no external deps)
// ---------------------------------------------------------------------------

function crc32(buf) {
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function solidPng(width, height, [r, g, b]) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: RGB
  const row = Buffer.alloc(1 + width * 3);
  row[0] = 0; // filter: none
  for (let x = 0; x < width; x++) {
    row[1 + x * 3] = r;
    row[2 + x * 3] = g;
    row[3 + x * 3] = b;
  }
  const idat = deflateSync(Buffer.concat(Array(height).fill(row)));
  return Buffer.concat([
    sig,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", idat),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let keyCounter = 0;
function key(prefix) {
  keyCounter += 1;
  return `${prefix}${keyCounter}`;
}

function block(style, text) {
  return {
    _type: "block",
    _key: key("b"),
    style,
    children: [
      { _type: "span", _key: key("s"), text, marks: [] },
    ],
    markDefs: [],
  };
}

function codeBlock(code, language) {
  return {
    _type: "code",
    _key: key("c"),
    code,
    language,
    filename: "example.js",
  };
}

async function uploadCover(name, colour) {
  const png = solidPng(800, 500, colour);
  const asset = await client.assets.upload("image", png, {
    filename: `${name}.png`,
    contentType: "image/png",
  });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const palette = [
  [99, 102, 241],   // indigo
  [16, 185, 129],   // emerald
  [244, 63, 94],    // rose
  [245, 158, 11],   // amber
  [59, 130, 246],   // blue
  [168, 85, 247],   // purple
];

const categories = [
  { _id: "seed-cat-engineering", title: "Engineering", slug: "engineering" },
  { _id: "seed-cat-design", title: "Design", slug: "design" },
  { _id: "seed-cat-tutorials", title: "Tutorials", slug: "tutorials" },
];

const author = {
  _id: "seed-author",
  _type: "author",
  name: "Asif",
  bio: "Developer who cares about fast, accessible, well-designed software.",
  image: { _type: "image", asset: { _type: "reference", _ref: null } },
};

const projects = [
  {
    _id: "seed-project-1",
    title: "Aurora Analytics",
    slug: "aurora-analytics",
    summary: "A realtime analytics dashboard for modern product teams.",
    techStack: ["Next.js", "TypeScript", "Tailwind", "Postgres"],
    githubUrl: "https://github.com/",
    liveUrl: "https://example.com",
    featured: true,
    order: 1,
    publishedAt: "2026-05-10T00:00:00.000Z",
    description: [
      block("h2", "Overview"),
      block("normal", "Aurora turns raw product events into live dashboards your team actually reads. Built for speed, with streaming updates over WebSockets."),
      block("h2", "Highlights"),
      block("normal", "Instant filters, shareable reports, and a plugin system for custom charts."),
    ],
  },
  {
    _id: "seed-project-2",
    title: "Beacon Chat",
    slug: "beacon-chat",
    summary: "A fast, minimal team chat with end-to-end encryption.",
    techStack: ["React", "Node.js", "WebSockets"],
    githubUrl: "https://github.com/",
    featured: false,
    order: 2,
    publishedAt: "2026-03-22T00:00:00.000Z",
    description: [
      block("h2", "Overview"),
      block("normal", "Beacon keeps conversations moving with optimistic UI and offline support."),
    ],
  },
  {
    _id: "seed-project-3",
    title: "Cinder Portfolio",
    slug: "cinder-portfolio",
    summary: "The open-source portfolio template you're looking at.",
    techStack: ["Next.js", "Sanity", "Tailwind", "shadcn/ui"],
    githubUrl: "https://github.com/",
    liveUrl: "https://example.com",
    featured: true,
    order: 3,
    publishedAt: "2026-06-01T00:00:00.000Z",
    description: [
      block("h2", "Overview"),
      block("normal", "Cinder is a fast, CMS-powered portfolio starter built with Next.js and Sanity."),
    ],
  },
  {
    _id: "seed-project-4",
    title: "Drift Weather",
    slug: "drift-weather",
    summary: "A delightful weather app with radar and rain alerts.",
    techStack: ["React Native", "GraphQL"],
    githubUrl: "https://github.com/",
    featured: false,
    order: 4,
    publishedAt: "2025-11-08T00:00:00.000Z",
    description: [
      block("h2", "Overview"),
      block("normal", "Drift tells you when to grab an umbrella before you step outside."),
    ],
  },
  {
    _id: "seed-project-5",
    title: "Ember Storefront",
    slug: "ember-storefront",
    summary: "A headless commerce storefront with a 100 Lighthouse score.",
    techStack: ["Next.js", "Stripe", "Tailwind"],
    githubUrl: "https://github.com/",
    liveUrl: "https://example.com",
    featured: false,
    order: 5,
    publishedAt: "2025-09-15T00:00:00.000Z",
    description: [
      block("h2", "Overview"),
      block("normal", "Ember proves that fast commerce is possible without a bloated platform."),
    ],
  },
  {
    _id: "seed-project-6",
    title: "Fable Blog",
    slug: "fable-blog",
    summary: "A minimal, CMS-driven blog engine with live previews.",
    techStack: ["Next.js", "Sanity", "Tailwind"],
    githubUrl: "https://github.com/",
    featured: true,
    order: 6,
    publishedAt: "2026-07-20T00:00:00.000Z",
    description: [
      block("h2", "Overview"),
      block("normal", "Fable pairs a focused writing experience with instant, realtime publishing."),
    ],
  },
];

const posts = [
  {
    _id: "seed-post-1",
    title: "How I structure Next.js apps",
    slug: "how-i-structure-nextjs-apps",
    excerpt: "A pragmatic folder layout for apps that scale past the starter template.",
    categories: ["seed-cat-engineering"],
    publishedAt: "2026-07-02T00:00:00.000Z",
    body: [
      block("h2", "Start with the route group"),
      block("normal", "Grouping pages under (site) and (studio) keeps shared layouts obvious and co-locates files where you expect them."),
      codeBlock("export default function HomePage() {\n  return <p>Hello world</p>\n}", "jsx"),
      block("h2", "Keep data fetching in one place"),
      block("normal", "Centralise GROQ queries and typed fetchers so pages stay declarative."),
    ],
  },
  {
    _id: "seed-post-2",
    title: "Designing with Tailwind v4",
    slug: "designing-with-tailwind-v4",
    excerpt: "The CSS-first config is a genuinely nicer workflow. Here's how I use it.",
    categories: ["seed-cat-design"],
    publishedAt: "2026-06-18T00:00:00.000Z",
    body: [
      block("normal", "Tailwind v4 moves configuration into CSS with @theme. It's less config to juggle and the output stays tiny."),
      codeBlock("@theme {\n  --color-accent: oklch(0.62 0.19 258);\n}", "css"),
    ],
  },
  {
    _id: "seed-post-3",
    title: "Building a CMS-powered portfolio",
    slug: "building-a-cms-portfolio",
    excerpt: "Why Sanity + Next.js is my default stack for content-driven sites.",
    categories: ["seed-cat-tutorials", "seed-cat-engineering"],
    publishedAt: "2026-05-30T00:00:00.000Z",
    body: [
      block("h2", "Content should be structured"),
      block("normal", "Structured content gives you typed data, reusable fields and realtime updates without a custom CMS."),
    ],
  },
  {
    _id: "seed-post-4",
    title: "Rethinking the color system",
    slug: "rethinking-the-color-system",
    excerpt: "OKLCH, semantic tokens, and why I stopped hand-picking hex values.",
    categories: ["seed-cat-design"],
    publishedAt: "2026-04-12T00:00:00.000Z",
    body: [
      block("normal", "Semantic tokens like --muted-foreground let you change a theme in one file instead of fifty."),
    ],
  },
];

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

async function main() {
  console.log(`Seeding "${dataset}" in project ${projectId}…`);

  // Author (upload an avatar, then patch the reference)
  const avatar = await uploadCover("author-yasir", palette[3]);
  author.image.asset._ref = avatar.asset._ref;
  await client.createOrReplace(author);
  console.log("✓ author");

  // Categories
  for (const category of categories) {
    await client.createOrReplace({
      _type: "category",
      ...category,
      slug: { _type: "slug", current: category.slug },
    });
  }
  console.log(`✓ ${categories.length} categories`);

  // Projects
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const cover = await uploadCover(project.slug, palette[i % palette.length]);
    await client.createOrReplace({
      _type: "project",
      ...project,
      slug: { _type: "slug", current: project.slug },
      coverImage: cover,
    });
  }
  console.log(`✓ ${projects.length} projects`);

  // Posts
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const cover = await uploadCover(post.slug, palette[(i + 2) % palette.length]);
    await client.createOrReplace({
      _type: "post",
      ...post,
      slug: { _type: "slug", current: post.slug },
      coverImage: cover,
      author: { _type: "reference", _ref: author._id },
      categories: post.categories.map((ref) => ({
        _type: "reference",
        _ref: ref,
      })),
    });
  }
  console.log(`✓ ${posts.length} posts`);

  console.log("\nDone! Open http://localhost:3000 to see the content.");
}

main().catch((error) => {
  console.error("Seed failed:", error.response?.body || error.message);
  process.exit(1);
});
