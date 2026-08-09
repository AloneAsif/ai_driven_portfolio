# Portfolio

A fast, content-driven portfolio built with **Next.js 16**, **Sanity CMS**, **Tailwind CSS v4**, and **shadcn/ui**. Manage everything — projects, blog posts, author and categories — from the embedded Sanity Studio at `/studio`.

## Tech stack

| Layer | What we use |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, shadcn/ui, lucide-react |
| CMS | Sanity 5 (Studio embedded at `/studio`), `next-sanity` |
| Deployment | Vercel (zero-config) |

## Getting started

### 1. Prerequisites

- **Node.js 20+** (this project was built on Node 24)
- A **Sanity project** (free) at [sanity.io](https://sanity.io)
- (Optional) A **Vercel** account for deployment

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Copy the example file and fill it in:

```bash
copy .env.example .env.local
```

The file `.env.local` should look like this:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-02-01

# Only needed if you want draft/preview (Visual Editing)
SANITY_API_READ_TOKEN=

# Optional — deployed URL, used by Visual Editing
# NEXT_PUBLIC_BASE_URL=https://your-site.vercel.app

# Optional — enables automatic contact-form email via Resend
# RESEND_API_KEY=
# CONTACT_FROM_EMAIL=onboarding@resend.dev
# CONTACT_TO_EMAIL=you@example.com
```

- **`NEXT_PUBLIC_SANITY_PROJECT_ID`** — find it in Sanity Manage → your project → API.
- **`SANITY_API_READ_TOKEN`** — *optional*. Published content is read over the public API, so the site works without a token. To enable draft previews, create a **read-only** token at Sanity Manage → **API → Tokens** → Add API token, and paste it here.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The Sanity Studio is at [http://localhost:3000/studio](http://localhost:3000/studio).

> **Note:** for live, real-time updates in the browser you must add `http://localhost:3000` to your project's **CORS origins** in Sanity Manage → API → CORS origins. Content still displays without this.

---

## Managing content in the Sanity Studio

All content lives in Sanity and is edited in the Studio — no code changes needed to publish content.

Open **`http://localhost:3000/studio`** and log in with your Sanity account (or the account that owns the project). The Studio is organized into:

- **Projects** — portfolio pieces shown on the homepage (when "Featured" is on) and the `/projects` grid.
- **Posts** — blog articles shown on `/blog`.
- **Authors** — who wrote the posts (author image, name, bio).
- **Categories** — tags you can attach to posts.

### Adding a blog post

1. Open the Studio at `/studio`.
2. In the left sidebar, click **Posts**.
3. Click the **+ Create** button (top-right).
4. Fill in the fields:
   - **Title** — required. The slug is generated from it automatically.
   - **Slug** — leave "Generate" to create it from the title, or write your own.
   - **Excerpt** — the short teaser shown on the blog grid and in search results.
   - **Body** — write the article. You can add headings, paragraphs, **code blocks**, and **images** from the editor toolbar.
   - **Cover Image** — the card image (tip: click it, then **Crop & position** to set a hotspot).
   - **Author** — pick an author from the list (create one under **Authors** first).
   - **Categories** — select one or more.
   - **Published at** — set a date; posts sort newest-first.
5. Click **Publish**.

The post appears on `/blog` and at `/blog/<slug>` immediately. With live preview enabled (see CORS note above), the page updates in real time.

### Adding a project

1. In the Studio, click **Projects** → **+ Create**.
2. Fields:
   - **Title**, **Slug**, **Summary** (short card text).
   - **Description** — full write-up using the rich-text editor.
   - **Cover Image** — required; this is the card thumbnail.
   - **Gallery** — extra screenshots (optional).
   - **Tech Stack** — tags like `Next.js`, `TypeScript` (shown as badges).
   - **GitHub URL** / **Live URL** — shown as buttons on the detail page.
   - **Featured** — turn this **on** to show the project on the homepage.
   - **Order** — lower numbers appear first.
   - **Published at**.
3. **Publish.**

### Adding an author / category

- **Authors**: Authors → **+ Create** → name, image, bio → Publish.
- **Categories**: Categories → **+ Create** → title + slug → Publish.

> Content you publish is available instantly because the dataset is public. You can also re-seed placeholder data at any time with `npm run seed` (see below).

---

## Publishing without redeploys

By default the site is statically generated at build time, so new/edited
content only shows up after a redeploy. To fix that, the project includes an
**on-demand revalidation endpoint** (`/api/revalidate`) that refreshes the
cache the moment you publish in the Studio — no redeploy needed.

### 1. Set a shared secret

Pick a long random string (e.g. `openssl rand -hex 32`) and use it in two
places:

- `.env.local` → `SANITY_REVALIDATE_SECRET=<that string>` (also add the same
  variable to **Vercel → Project → Settings → Environment Variables**).
- The Sanity webhook (step 2) — same value.

### 2. Add a Sanity webhook

1. Go to [sanity.io/manage](https://sanity.io/manage) → your project →
   **API → Webhooks** → **Add webhook**.
2. **URL**: `https://<your-site>.vercel.app/api/revalidate`
   (use `http://localhost:3000/api/revalidate` while testing locally).
3. **Method**: POST.
4. **Secret**: paste the value from step 1.
5. **Filter** — limit to the content types the site shows:
   `_type in ["project", "post", "category"]`
6. Keep the default triggers (**create**, **update**, **delete**).
7. Save, then click **Test** — it should return `{"revalidated": true}`.

Now publish a project in the Studio and refresh the site: it appears
immediately, with no redeploy.

### 3. (Optional) True in-browser real-time editing

For live updates *while you edit* (Sanity Visual Editing / Presentation):

1. Create a **read-only** API token at Sanity Manage → **API → Tokens** and set
   `SANITY_API_READ_TOKEN` in `.env.local` (and on Vercel).
2. Add `http://localhost:3000` and your deployed URL to **API → CORS origins**.
3. Set `NEXT_PUBLIC_BASE_URL` to your deployed URL.

---

## Changing or adding fields in Sanity

Every content type is a **schema** defined in `src/sanity/schemaTypes/`. To change which fields exist in the Studio, edit these files — then restart the dev server.

### Where the schemas live

```
src/sanity/schemaTypes/
├── project.ts    # Projects document
├── post.ts       # Blog posts document
├── author.ts     # Author document
└── category.ts   # Category document
```

### Example: add a "client name" field to projects

Open `src/sanity/schemaTypes/project.ts` and add a field inside the `fields` array:

```ts
defineField({
  name: "clientName",
  title: "Client Name",
  type: "string",
}),
```

### Common field types

| Type | Use it for |
|---|---|
| `string` | Short text (titles, names) |
| `text` | Longer text (summaries, bios) |
| `url` | Links (GitHub, live site) |
| `boolean` | On/off switches (`featured`) |
| `number` | Numbers (`order`) |
| `datetime` | Dates (`publishedAt`) |
| `image` | Images (supports hotspot/crop) |
| `array` of `string` | Tag lists (`techStack`) |
| `array` of `block` | Rich text / portable text (`description`, `body`) |
| `reference` | Link to another document (e.g. post → author) |
| `array` of `reference` | Multiple links (e.g. post → categories) |
| `slug` | URL-friendly identifier |

### Making a new field show on the website

Adding the field to the schema only adds it to the **Studio** (so you can enter data). To display it on the site:

1. **Fetch it** — open the relevant GROQ query in `src/sanity/lib/queries.ts` and add the field to the projection (e.g. `clientName`).
2. **Render it** — add it to the page/component in `src/app/` that shows that content.

Then restart the dev server (`Ctrl+C`, then `npm run dev`).

### After changing a schema

1. Stop the dev server.
2. Restart with `npm run dev`.
3. Hard-refresh the Studio in your browser (`Ctrl+Shift+R`) so it picks up the new fields.

> In production you'd just re-deploy — the Studio reads the schema from the deployed code.

---

## Seeding dummy data

`scripts/seed.mjs` inserts placeholder projects, posts, an author and categories:

```bash
# uses a write-capable Sanity token (not stored in .env.local)
$env:SANITY_WRITE_TOKEN = "your-write-token"
npm run seed
```

It's safe to re-run (documents are overwritten; image assets accumulate). Edit the content in `scripts/seed.mjs` to change what gets seeded.

---

## Project structure

```
src/
├── app/
│   ├── (site)/               # Public site pages
│   │   ├── page.tsx          # Home (hero + about + featured projects)
│   │   ├── projects/         # Projects grid + detail
│   │   ├── blog/             # Blog grid + post detail
│   │   └── contact/          # Contact page
│   ├── studio/[[...tool]]/   # Embedded Sanity Studio
│   ├── api/                  # API routes (draft, disable-draft, contact)
│   ├── layout.tsx            # Root layout (fonts, theme, <SanityLive />)
│   ├── globals.css           # Tailwind v4 + theme
│   ├── sitemap.ts            # SEO sitemap
│   └── robots.ts             # robots.txt
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── nav.tsx / footer.tsx  # Shared site chrome
│   ├── project-card.tsx / post-card.tsx
│   └── portable-text.tsx     # Rich-text renderer
├── sanity/
│   ├── schemaTypes/          # Content schemas (edit these to change fields)
│   ├── lib/queries.ts        # GROQ queries
│   ├── lib/live.ts           # defineLive / sanityFetch
│   ├── lib/data.ts           # Server fetch helper
│   ├── lib/image.ts          # Sanity image URL builder
│   ├── client.ts             # Sanity client
│   └── env.ts                # Env var access
└── lib/site.ts               # Site-wide config (name, bio, social links)
```

---

## Deployment (Vercel)

1. Push the project to a GitHub repository.
2. Import it into [Vercel](https://vercel.com) — it auto-detects Next.js.
3. Add the same variables from `.env.local` to **Vercel → Project → Settings → Environment Variables**.
4. In Sanity Manage → API → **CORS origins**, add your deployed URL (e.g. `https://your-site.vercel.app`).
5. Set `NEXT_PUBLIC_BASE_URL` to your deployed URL for Visual Editing links.

---

## Contact form

The form at `/contact` posts to `/api/contact`. Without configuration it builds a `mailto:` link so the visitor sends the email from their own client. To send email automatically, add a Resend key:

```bash
RESEND_API_KEY=re_...
CONTACT_FROM_EMAIL=onboarding@resend.dev
CONTACT_TO_EMAIL=you@example.com
```

## Troubleshooting

- **Studio shows "missing projectId"** — set `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local` and restart.
- **No projects/posts on the site** — the dataset is empty, or `NEXT_PUBLIC_SANITY_PROJECT_ID`/dataset don't match. Check Sanity Manage, then run `npm run seed`.
- **"`apicdn.sanity.io` ... EAI_AGAIN"** — this network can't reach the Sanity CDN host. The client is set to `useCdn: false` to avoid it (see `src/sanity/client.ts`).
- **Live updates don't happen in the browser** — add `http://localhost:3000` (and your deployed URL) to the project's **CORS origins** in Sanity Manage.
- **Port 3000 already in use** — run `npm run dev -- -p 3001` or free the port.
