import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * On-demand revalidation endpoint for Sanity webhooks.
 *
 * When you publish/update/delete a document in the Sanity Studio, Sanity
 * POSTs here. The route verifies the request signature and then invalidates
 * the cached data + pages for the affected content type, so the site
 * reflects the change **without a redeploy**.
 *
 * Setup (Sanity Manage -> API -> Webhooks):
 *   - URL:   https://<your-site>/api/revalidate
 *   - Method: POST
 *   - Secret: a value matching SANITY_REVALIDATE_SECRET in .env.local / Vercel
 *   - HTTP headers: (optional) Authorization = same secret
 *   - Filter: _type in ["project", "post", "category"]
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET?.trim();
  if (!secret || secret === ";") {
    return Response.json(
      { message: "Revalidation secret is not configured" },
      { status: 500 },
    );
  }

  // Verifies the "sanity-webhook-signature" header with the shared secret.
  const { body, isValidSignature } = await parseBody(request, secret);
  if (!isValidSignature) {
    return Response.json(
      { message: "Invalid signature" },
      { status: 401 },
    );
  }

  const type = body?._type as string | undefined;
  const slug = (body?.slug as { current?: string } | undefined)?.current;

  // Invalidate the caches for the content type that changed.
  if (type === "project" || type === "post" || type === "category") {
    revalidateTag(type, "max");
  }

  // Refresh every page that lists content plus the detail page for a slug.
  revalidatePath("/", "layout");

  if (type === "project") {
    revalidatePath("/projects", "page");
    if (slug) revalidatePath(`/projects/${slug}`, "page");
  }

  if (type === "post") {
    revalidatePath("/blog", "page");
    if (slug) revalidatePath(`/blog/${slug}`, "page");
  }

  return Response.json({ revalidated: true, now: Date.now() });
}