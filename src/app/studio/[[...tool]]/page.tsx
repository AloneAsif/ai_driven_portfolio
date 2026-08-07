"use client";

import { useEffect, useState } from "react";
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

/**
 * Embedded Sanity Studio.
 *
 * Rendered client-side only: the Studio is a heavy React app that can't be
 * server-rendered without triggering React hook/context errors (it ships its
 * own React tooling). The `mounted` gate renders nothing on the server and
 * mounts the Studio after hydration, so SSR stays clean. Metadata/viewport
 * live in ../layout.tsx.
 */
export default function StudioPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <NextStudio config={config} />;
}
