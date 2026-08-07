import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site";

export async function GET() {
  const dm = await draftMode();
  dm.disable();
  return NextResponse.redirect(new URL("/", siteConfig.url));
}
