import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";
import { getFallbackPageView } from "@/data/fallback-pages";
import { cacheTags } from "@/lib/cache-tags";
import { connectMongo } from "@/lib/mongoose";
import Page from "@/models/Page";
import type { PageSection } from "@/types/section";

function normalizeSectionType(value: string) {
  const trimmed = String(value).trim();
  if (trimmed === "aboutIntro") return "aboutOverview";
  if (trimmed === "industrieshero") return "industriesHero";
  if (trimmed === "industriesgrid") return "industriesGrid";
  if (trimmed === "industriescta") return "industriesCta";
  if (trimmed === "servicesgrid") return "servicesGrid";
  if (trimmed === "servicesaccordion") return "servicesAccordion";
  if (trimmed === "servicescta") return "servicesCTA";
  if (trimmed === "serviceslicensing") return "servicesLicensing";
  if (trimmed === "projectshero") return "projectsHero";
  if (trimmed === "projectsgrid") return "projectsGrid";
  if (trimmed === "projectsintegrity") return "projectsIntegrity";
  if (trimmed === "projectspartners") return "projectsPartners";
  return trimmed;
}

export type PublicPageView = {
  slug: string;
  title: string;
  status: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  canonicalPath?: string;
  effectiveSections: PageSection[];
  isPreview: boolean;
};

function toPlainSections(sections: unknown): PageSection[] {
  if (!Array.isArray(sections)) return [];
  return sections as PageSection[];
}

function pageToPublicView(
  page: {
    slug: string;
    title: string;
    status: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
    ogImage?: string | null;
    canonicalPath?: string | null;
    publishedSections?: unknown;
    sections?: unknown;
  },
  opts: { published: boolean; isPreview: boolean },
): PublicPageView {
  const source =
    opts.published && Array.isArray(page.publishedSections) && page.publishedSections.length
      ? page.publishedSections
      : page.sections;

  let effectiveSections = toPlainSections(source);
  const slugOrder =
    page.slug === "home"
      ? {
          hero: 0,
          homeAbout: 1,
          homeServicesGrid: 2,
          homeProductCategories: 3,
          homeWhyChoose: 4,
          homeTrustedBy: 5,
          homeQuickInquiry: 6,
        }
      : page.slug === "about"
        ? {
            aboutHero: 0,
            aboutMission: 1,
            aboutRegulatory: 2,
            aboutLeadership: 3,
            aboutInquiry: 4,
          }
        : page.slug === "services"
          ? {
              servicesPageHero: 0,
              servicesCapabilityCards: 1,
              servicesSpecialized: 2,
              servicesProductCatalog: 3,
              servicesRegulatory: 4,
            }
          : page.slug === "products"
            ? {
                productsCatalogShowcase: 0,
              }
            : page.slug === "product-detail"
              ? {
                  servicesProductCatalog: 0,
                  productsFooter: 1,
                }
          : page.slug === "clients"
            ? {
                clientsPageHero: 0,
                clientsSectors: 1,
                clientsCompliance: 2,
                clientsTrustedBy: 3,
                clientsPartnerCta: 4,
              }
            : null;

  if (slugOrder) {
    const orderMap = slugOrder as unknown as Record<string, number>;
    effectiveSections = effectiveSections
      .map((s) => {
        const t = normalizeSectionType(String(s.type));
        if (orderMap[t] === undefined) return null;
        return { ...s, type: t, order: orderMap[t] };
      })
      .filter((s): s is PageSection => s !== null)
      .sort((a, b) => a.order - b.order);
  }
  return {
    slug: page.slug,
    title: page.title,
    status: page.status,
    seoTitle: page.seoTitle ?? undefined,
    seoDescription: page.seoDescription ?? undefined,
    ogImage: page.ogImage ?? undefined,
    canonicalPath: page.canonicalPath ?? undefined,
    effectiveSections,
    isPreview: opts.isPreview,
  };
}

async function fetchPublishedPage(slug: string): Promise<PublicPageView | null> {
  await connectMongo();
  const page = await Page.findOne({ slug }).lean();
  if (!page) return null;

  const isDev = process.env.NODE_ENV === "development";

  if (page.status !== "published") {
    if (!isDev) return null;
    return pageToPublicView(page, { published: false, isPreview: true });
  }

  return pageToPublicView(page, { published: true, isPreview: false });
}

const getPublishedPageProduction = (slug: string) =>
  unstable_cache(() => fetchPublishedPage(slug), ["published-page", slug], {
    tags: [cacheTags.page(slug)],
  });

/** Production: cached. Development: always fresh DB read (avoids sticky `null` after `pnpm seed`). */
export async function getPublishedPageCached(slug: string): Promise<PublicPageView | null> {
  if (process.env.NODE_ENV === "development") {
    return fetchPublishedPage(slug);
  }
  return getPublishedPageProduction(slug)();
}

/** Preview / draft: bypass cache; only call when draftMode is enabled (or admin). */
export async function getPageDraftView(slug: string): Promise<PublicPageView | null> {
  await connectMongo();
  const page = await Page.findOne({ slug }).lean();
  if (!page) return null;
  return pageToPublicView(page, { published: false, isPreview: true });
}

export async function resolvePageForRequest(slugIn: string): Promise<PublicPageView | null> {
  const slug = slugIn.toLowerCase();
  const { isEnabled } = await draftMode();
  if (isEnabled) {
    const d = await getPageDraftView(slug);
    if (d) return d;
    return getFallbackPageView(slug);
  }

  const live = await getPublishedPageCached(slug);
  if (live) return live;
  return getFallbackPageView(slug);
}
