"use client";

import SiteFooter, { type FooterColumn } from "@/components/layout/SiteFooter";

type FooterMeta = {
  brand: string;
  description: string;
  social: Array<string | { label: string; href: string; icon?: string }>;
  copyright: string;
  legal: Array<string | { label: string; href: string; icon?: string }>;
};

/** Global site footer — same layout on every marketing page (matches home). */
export default function ConditionalSiteFooter({
  columns,
  meta,
}: {
  columns: FooterColumn[];
  meta: FooterMeta;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return <SiteFooter columns={columns} meta={meta} />;
}
