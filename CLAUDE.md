# Portfolio Website — Build Spec (Next.js 16 + Sanity + Tailwind v4 + shadcn/ui)

> Save this file as `CLAUDE.md` in your project root. Claude Code automatically
> reads `CLAUDE.md` for project context, so once it exists you can just run
> `claude` in the folder and say "set up the project following CLAUDE.md".

## 0. Prerequisites (do these once, before running Claude Code)

1. **Node.js 20+** installed (`node -v` to check).
2. **Claude Code CLI** installed:
   - macOS/Linux: `curl -fsSL https://claude.ai/install.sh | bash`
   - Windows: run the PowerShell installer from https://code.claude.com/docs/en/setup
   - Verify: `claude --version`
   - You need a Claude Pro/Max/Team/Enterprise plan, or an API key billed via console.anthropic.com — the free Claude.ai plan doesn't include Claude Code.
3. **A free Sanity account** at https://sanity.io (you'll create a project + dataset — Claude Code can do this for you via `npx sanity init` if you run it interactively, or you can create it manually first and hand Claude the project ID).
4. **A Vercel account** at https://vercel.com (for deployment) and ideally a GitHub repo already created for this project.

## 1. Tech stack (pin these — don't let anything drift to older majors)

| Layer | Package | Notes |
|---|---|---|
| Framework | `next@16` | App Router, Turbopack (default), Cache Components |
| Runtime | React 19.2 | ships with Next 16, no separate install needed |
| CMS | `sanity@5` | Studio v5, embedded at `/studio` route |
| CMS toolkit | `next-sanity@13` | client, `defineLive`, Visual Editing |
| Styling | `tailwindcss@4` | new CSS-first config (`@import "tailwindcss"` in globals.css, no `tailwind.config.js` needed) |
| UI components | `shadcn/ui` | installed via `npx shadcn@latest init` |
| Icons | `lucide-react` | pairs with shadcn |
| Deployment | Vercel | zero-config for Next.js |

## 2. Project structure

Use a single Next.js app with Sanity Studio embedded as a route (simplest for a solo portfolio — no monorepo needed):

```
portfolio/
├── src/
│   ├── app/
│   │   ├── (site)/
│   │   │   ├── page.tsx                 # Home: hero + about + featured projects
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx             # Projects grid
│   │   │   │   └── [slug]/page.tsx      # Project detail
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx             # Blog grid
│   │   │   │   └── [slug]/page.tsx      # Post detail
│   │   │   └── contact/page.tsx
│   │   ├── studio/[[...tool]]/page.tsx  # Embedded Sanity Studio
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── ui/                          # shadcn components live here
│   │   ├── nav.tsx
│   │   ├── footer.tsx
│   │   ├── project-card.tsx
│   │   └── post-card.tsx
│   └── sanity/
│       ├── env.ts
│       ├── client.ts
│       ├── lib/live.ts                  # defineLive
│       ├── schemaTypes/
│       │   ├── project.ts
│       │   ├── post.ts
│       │   ├── author.ts
│       │   ├── category.ts
│       │   └── index.ts
│       └── structure.ts
├── sanity.config.ts
├── sanity.cli.ts
└── .env.local
```

## 3. Sanity schemas

**`project` document:**
- `title` (string, required)
- `slug` (slug, source: title, required)
- `summary` (text, short — used in cards)
- `description` (array of block content / portable text — full write-up)
- `coverImage` (image, hotspot enabled, required)
- `gallery` (array of images, optional)
- `techStack` (array of strings — tags like "Next.js", "TypeScript")
- `githubUrl` (url, optional)
- `liveUrl` (url, optional)
- `featured` (boolean — shows on homepage)
- `order` (number — manual sort control)
- `publishedAt` (datetime)

**`post` document (blog):**
- `title`, `slug`, `excerpt`
- `body` (portable text — support headings, code blocks, images)
- `coverImage`
- `author` (reference to `author`)
- `categories` (array of references to `category`)
- `publishedAt`

**`author` document:** `name`, `image`, `bio`

**`category` document:** `title`, `slug`

Order projects and posts by `order` / `publishedAt desc` in GROQ queries.

## 4. Sanity + Next.js wiring

- Use `defineLive` from `next-sanity/live` in `src/sanity/lib/live.ts` — this gives you `sanityFetch` (server-side, cache-aware) and a `<SanityLive />` component for real-time updates. Render `<SanityLive />` once in the root layout.
- Use `apiVersion: '2026-02-01'` (or later) when configuring the client.
- Mount Studio at `/studio` via `NextStudio` in `src/app/studio/[[...tool]]/page.tsx`.
- Enable Draft Mode + Visual Editing so clicking content in the Presentation tool jumps to the matching Studio field.
- Environment variables needed in `.env.local`:
  ```
  NEXT_PUBLIC_SANITY_PROJECT_ID=
  NEXT_PUBLIC_SANITY_DATASET=production
  NEXT_PUBLIC_SANITY_API_VERSION=2026-02-01
  SANITY_API_READ_TOKEN=
  ```

## 5. Pages & components

- **Home** — hero (name, role, short pitch, CTA buttons), about blurb, "featured" projects pulled where `featured == true`, link to full projects page.
- **Projects grid** — all projects, filterable by tech stack tag if time allows, cards linking to `/projects/[slug]`.
- **Project detail** — cover image, description (portable text renderer), tech stack badges, GitHub/live links, gallery.
- **Blog grid** — all posts sorted newest first, optional category filter.
- **Post detail** — portable text renderer with code block + image support, author byline.
- **Contact** — simple form (name, email, message) posting to a Next.js Route Handler that sends email via Resend or similar, or a `mailto:` fallback if you don't want a backend email service yet.
- **Nav/Footer** — shared across `(site)` route group, sticky nav, social links, dark mode toggle (shadcn `ThemeProvider`).

## 6. Styling direction

- Tailwind v4, CSS-first config (`@theme` block in `globals.css` for custom colors/fonts — no separate `tailwind.config.ts` required unless you need JS-level config).
- Install shadcn/ui components as needed: `button`, `card`, `badge`, `dialog`, `navigation-menu`, `input`, `textarea`, `separator`.
- Pick one accent color + a clean sans/mono pairing (e.g. Geist, which ships with `create-next-app`). Keep layout minimal — generous whitespace, large type for the hero, subtle hover states on cards.

## 7. SEO / polish

- `generateMetadata` per page (title, description, OG image from `coverImage` where relevant).
- `src/app/sitemap.ts` generating URLs from Sanity project/post slugs.
- `robots.txt` via `src/app/robots.ts`.

## 8. Deployment

- Push to GitHub, import into Vercel.
- Add the same env vars from `.env.local` to the Vercel project settings.
- Add your deployed Vercel URL to **CORS origins** in Sanity Manage (sanity.io/manage) so the frontend can fetch content.
- Add the Vercel URL to Sanity's Studio "Deploy" settings if you also deploy Studio standalone (not required if embedding at `/studio`).

---

## Kickoff prompt for Claude Code

Once `claude` is running in an empty project folder with this `CLAUDE.md` present, paste:

```
Set up this project following CLAUDE.md exactly. Steps:
1. Scaffold with `npx create-next-app@latest` — TypeScript, Tailwind, App Router, Turbopack, src/ directory, no --yes flag, use the latest Next 16.
2. Run `npx sanity@latest init` to connect/create the Sanity project (ask me for
   the project ID/dataset if you can't run this interactively), then install
   `next-sanity`.
3. Build the schema types, sanity client, and defineLive wiring exactly as
   described in section 3-4 of CLAUDE.md.
4. Install shadcn/ui and the components listed in section 6.
5. Build every page and component listed in section 5, using placeholder copy
   for my name/bio where you don't have real content, wired to live Sanity data.
6. Add SEO metadata, sitemap, and robots.txt per section 7.
7. Confirm the dev server runs clean with `next dev`, fix any type/build errors,
   then tell me what env vars I still need to fill in before deploying.
```

Claude Code will ask clarifying questions as it goes (your real name/bio, whether you want a contact-form email backend, color palette preference) — answer inline and it'll keep building.

---

# Chat Widget Integration — Build Spec (for Claude Code CLI)

> This task only touches the Next.js frontend. The RAG chatbot backend is a
> **separate project** (Python / Hugging Face Spaces) — do not read or modify
> anything in the sibling `portfolio-chatbot*` folder(s).

## 0. Isolation rules

- Work only inside this Next.js project. Don't read or modify anything in
  the sibling `portfolio-chatbot*` folder(s) — that's a separate Python/HF
  Spaces project with its own lifecycle.
- Don't touch Sanity schemas or the Studio — this task is frontend-only.

## 1. Prerequisite

The RAG chatbot backend already exists and is reachable at some URL —
either running locally (`http://localhost:7860`) during development, or
already deployed to Hugging Face Spaces
(`https://<hf-username>-<space-name>.hf.space`). If it's not deployed yet,
that's fine — build against `localhost:7860` for now and swap the env var
later.

## 2. Env var

Add to `.env.local`:
```
NEXT_PUBLIC_CHATBOT_API_URL=http://localhost:7860
```
(Later, add the same variable with the real HF Space URL to the Vercel
project's environment settings — production build reads it at build/runtime
since it's `NEXT_PUBLIC_*`.)

## 3. What to build

**`src/components/chat-widget.tsx`** — a client component (`"use client"`):

- A floating round button, fixed bottom-right, visible on every page (icon:
  a chat bubble from `lucide-react`).
- Clicking it expands a chat panel (use shadcn/ui `Card`, `Button`, `Input`,
  `ScrollArea`, `Badge` — install any not already present via
  `npx shadcn@latest add <component>`).
- Panel behavior:
  - Message list, user messages right-aligned, assistant left-aligned.
  - Text input + send button at the bottom; Enter submits.
  - Keep conversation state in React `useState` — `{ role: "user" | "assistant", content: string }[]`.
  - On send: POST to `` `${process.env.NEXT_PUBLIC_CHATBOT_API_URL}/chat` ``
    with body `{ message, history }` where `history` is the prior messages
    array (send the last ~6 for context, matching the backend's own trim).
  - Show a subtle typing/loading indicator while awaiting the response.
  - Render the returned `sources` (array of `{type, title, slug, url}`) as
    small clickable badges under the assistant's message — link project
    sources to `/projects/[slug]` and post sources to `/blog/[slug]` using
    Next.js `<Link>`.
  - On fetch error or non-200: show a friendly fallback bubble ("Having
    trouble reaching the assistant right now — feel free to check the
    Projects page or use the Contact form instead") rather than a raw error.
  - First request after backend idle may take a few extra seconds (free-tier
    cold start) — if no response within ~5s, show a small "waking up,
    almost there…" note rather than looking frozen.
- Mobile: panel goes full-screen (or near-full-height) below `sm` breakpoint
  instead of a small floating box.
- Close button / click-outside / Escape key all close the panel.
- Accessible: proper `aria-label`s on the toggle button and close button,
  focus moves into the panel on open.

**Mount it once** in `src/app/layout.tsx` (root layout, outside the
`(site)`-only pages if there's a route-group split, so it doesn't render
inside `/studio`) so it's available site-wide.

## 4. Styling

Match the existing Tailwind v4 + shadcn/ui theme and accent color already
established in the project — don't introduce a new color palette. Keep the
closed-state button unobtrusive (icon-only, ~48px).

## 5. CORS reminder

The chatbot backend's `ALLOWED_ORIGINS` env var must include this site's
actual origin(s) — `http://localhost:3000` for dev and the production
Vercel domain once deployed — or the browser will block the requests. This
is set on the **backend** (HF Space secrets), not here; just flag it in the
final summary as a check-before-you-ship item.

## 6. Definition of done

- Widget renders on every page, toggles open/closed.
- Sending a message while the backend is running locally returns a real
  answer with clickable source badges.
- Network/error states show the friendly fallback, not a broken UI.
- `npm run build` succeeds with no type errors.
- Nothing outside this Next.js project was touched.

---

## Kickoff prompt for Claude Code

In the portfolio project root, with this file saved as `CLAUDE.md`, run
`claude` and paste:

```
Read CLAUDE.md and build the chat widget it describes. Check my existing
components/ folder and tailwind setup first so the widget matches my
current design system exactly rather than introducing new patterns. Install
any missing shadcn/ui components. Wire it to NEXT_PUBLIC_CHATBOT_API_URL
from .env.local. Stay entirely inside this project — don't touch the
separate chatbot backend folder. When done, run `npm run dev`, confirm the
widget renders and (if I have the backend running locally) that sending a
message works end to end, then tell me what's left before I deploy.
```