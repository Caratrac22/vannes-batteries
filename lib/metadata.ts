// ============================================================
// VANNES BATTERIES — Centralized metadata helper
// ============================================================

import type { Metadata } from "next";

const SITE_URL = "https://www.vannes-batteries.fr";
const SITE_NAME = "VANNES BATTERIES";

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
}

export function generatePageMetadata({
  title,
  description,
  path,
  ogTitle,
}: PageMetadataOptions): Metadata {
  const canonicalUrl = `${SITE_URL}${path}`;
  const resolvedOgTitle = ogTitle || title;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: resolvedOgTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedOgTitle,
      description,
    },
    other: {
      "fb:admins": "vannes.batteries",
    },
  };
}
