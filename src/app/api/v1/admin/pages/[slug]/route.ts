import { auth } from "@/auth";
import { jsonData, jsonError } from "@/lib/api-response";
import { revalidatePage, revalidateSiteGlobal } from "@/lib/revalidate-content";
import { slugToHref, normalizePageSlug } from "@/lib/slugs";
import { connectMongo } from "@/lib/mongoose";
import Page from "@/models/Page";
import SiteGlobal from "@/models/SiteGlobal";
import { parseSectionData } from "@/schemas/sections";
import { z } from "zod";
import type { PageSection } from "@/types/section";
import { nanoid } from "nanoid";

function buildHomeSections(): PageSection[] {
  const defs: Array<{ type: PageSection["type"]; order: number; data: Record<string, unknown> }> = [
    {
      type: "hero",
      order: 0,
      data: {
        badge: "ENTERPRISE GRADE INTELLIGENCE",
        title: ["POWERING", "SECURE", "AND", "FUTURE", "TECHNOLOGY"],
        description:
          "Adam Technology L.L.C. delivers high-precision digital infrastructure for the modern era. We architect, secure, and scale enterprise systems with industrial-grade resilience.",
        primaryAction: { label: "EXPLORE SERVICES", href: "/services" },
        secondaryAction: { label: "BOOK FREE ADVICE", href: "/contact" },
        backgroundImage: "/home/hero-building.jpg",
      },
    },
    {
      type: "intro",
      order: 1,
      data: {
        eyebrow: "About Us",
        title: ["THE ARCHITECT OF", "ENTERPRISE", "TRUST"],
        description:
          "Headquartered in Dubai, Adam Technology L.L.C. stands at the intersection of security and innovation. We provide the sovereign digital foundations that global enterprises rely on.",
        highlights: [],
        image: "/home/headquarters.png",
        more: "",
        href: "/about",
        icon: "",
        expcount: 10,
      },
    },
    {
      type: "services",
      order: 2,
      data: {
        eyebrow: "OUR CAPABILITIES",
        title: "CORE PILLARS",
        description:
          "Modular solutions designed to scale with the complexity of your operational demands.",
        backgroundImage: "",
        cards: [
          {
            icon: "security",
            title: "CYBER SECURITY",
            description:
              "Defensive architecture and threat intelligence systems built to withstand the most sophisticated breaches.",
          },
          {
            icon: "online",
            title: "DATA & CLOUD",
            description:
              "High-performance cloud migration and sovereign data warehousing for sensitive enterprise assets.",
          },
          {
            icon: "innovation",
            title: "SOFTWARE & DEV",
            description:
              "Custom enterprise software engineered with a security-first methodology and technical excellence.",
          },
          {
            icon: "corporate",
            title: "CONSULTING",
            description:
              "Strategic advisory and specialized workforce training to foster a culture of technological resilience.",
          },
        ],
      },
    },
    {
      type: "whyChoose",
      order: 3,
      data: {
        title: "",
        subheading: "",
        items: [
          {
            icon: "ShieldCheck",
            title: "END-TO-END SECURITY",
            description:
              "We don't just 'treat' security; we build it into the DNA of every solution. From physical server security to encrypted application layers, your data remains impenetrable.",
            tags: ["ENCRYPTION", "ZERO TRUST", "SOVEREIGN CONTROL"],
          },
          {
            icon: "Sparkles",
            title: "FUTURE-READY TECH",
            description:
              "Anticipating the next decade of digital evolution. Our stacks are built for modularity, ensuring you can integrate AI, Blockchain, and Quantum protocols seamlessly.",
            tags: ["AI-DRIVEN", "EDGE READY", "SCALABLE MESH"],
          },
        ],
      },
    },
    {
      type: "clientLogos",
      order: 4,
      data: {
        eyebrow: "TRUSTED BY INSTITUTIONAL LEADERS",
        logos: ["GLOBAL BANK", "TECH LOGISTICS", "DUBAI URBAN", "GOV SECTOR", "CORE ENERGY"],
      },
    },
    {
      type: "cta",
      order: 5,
      data: {
        title: "SYSTEM DEPLOYMENT STARTS HERE",
        description: "Secure your digital future with the UAE's premier technical architectural firm.",
        action: { label: "BOOK CONSULTATION", href: "/contact" },
      },
    },
  ];

  return defs.map((d) => ({
    id: nanoid(),
    type: d.type,
    order: d.order,
    data: parseSectionData(d.type, d.data) as Record<string, unknown>,
  }));
}

const patchBodySchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  status: z.enum(["draft", "published"]).optional(),
  sections: z
    .array(
      z.object({
        id: z.string(),
        type: z.string(),
        order: z.number(),
        data: z.unknown(),
      }),
    )
    .optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogImage: z.string().optional(),
  canonicalPath: z.string().optional(),
});

type RouteContext = { params: Promise<{ slug: string }> };

function ensureHomeHasSections(sections: PageSection[]): PageSection[] {
  const defaults = buildHomeSections();
  const desiredTypes = ["whyChoose", "clientLogos"];

  let next = [...sections];
  for (const t of desiredTypes) {
    if (next.some((s) => String(s.type) === t)) continue;
    const fallback = defaults.find((s) => String(s.type) === t);
    if (fallback) next.push(fallback);
  }

  const desiredOrder: Record<string, number> = {
    hero: 0,
    intro: 1,
    services: 2,
    whyChoose: 3,
    clientLogos: 4,
    cta: 5,
  };

  next = next.map((s) => {
    const t = String(s.type);
    if (desiredOrder[t] === undefined) return s;
    if (s.order === desiredOrder[t]) return s;
    return { ...s, order: desiredOrder[t] };
  });

  next.sort((a, b) => a.order - b.order);
  return next;
}

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonError("unauthorized", "Sign in required", 401);
  }
  const { slug } = await context.params;
  await connectMongo();

  if (slug === "home") {
    const existingDoc = await Page.findOne({ slug });
    if (existingDoc) {
      const nextSections = ensureHomeHasSections(existingDoc.sections as PageSection[]);
      const nextPublished = ensureHomeHasSections(
        (existingDoc.publishedSections as PageSection[]) ?? [],
      );

      const normalizeForCompare = (list: PageSection[]) =>
        list.map((s) => ({ id: s.id, type: s.type, order: s.order }));

      const currentSections = existingDoc.sections as PageSection[];
      const currentPublished = (existingDoc.publishedSections as PageSection[]) ?? [];

      const sectionsChanged =
        JSON.stringify(normalizeForCompare(nextSections)) !==
        JSON.stringify(normalizeForCompare(currentSections));
      const publishedChanged =
        JSON.stringify(normalizeForCompare(nextPublished)) !==
        JSON.stringify(normalizeForCompare(currentPublished));

      if (sectionsChanged) existingDoc.set("sections", JSON.parse(JSON.stringify(nextSections)));
      if (publishedChanged)
        existingDoc.set("publishedSections", JSON.parse(JSON.stringify(nextPublished)));
      if (sectionsChanged || publishedChanged) await existingDoc.save();

      return jsonData(existingDoc.toObject());
    }
  } else {
    const existing = await Page.findOne({ slug }).lean();
    if (existing) return jsonData(existing);
  }

  if (slug !== "home") {
    return jsonError("not_found", "Page not found", 404);
  }

  const created = await Page.create({
    slug: "home",
    title: "Home",
    status: "draft",
    sections: buildHomeSections(),
    publishedSections: [],
    seoTitle: "Adam Technology L.L.C.",
    seoDescription:
      "Adam Technology L.L.C. delivers enterprise-grade cybersecurity, cloud & data infrastructure, and custom software engineering from Dubai, UAE.",
  });

  return jsonData(created.toObject());
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonError("unauthorized", "Sign in required", 401);
  }
  const { slug } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("bad_request", "Invalid JSON", 400);
  }
  const parsed = patchBodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("validation_error", "Invalid payload", 422, parsed.error.flatten());
  }

  let normalizedSections: PageSection[] | undefined;
  const normalizedSlug =
    parsed.data.slug !== undefined ? normalizePageSlug(parsed.data.slug) : undefined;

  if (slug === "home" && normalizedSlug !== undefined && normalizedSlug !== "home") {
    return jsonError("validation_error", "Home page slug cannot be changed", 422);
  }

  if (parsed.data.sections) {
    normalizedSections = [];
    for (const s of parsed.data.sections) {
      try {
        const data = parseSectionData(s.type, s.data);
        normalizedSections.push({
          id: s.id,
          type: s.type as PageSection["type"],
          order: s.order,
          data: data as Record<string, unknown>,
        });
      } catch (e) {
        return jsonError(
          "validation_error",
          `Section ${s.id}: ${e instanceof Error ? e.message : "invalid"}`,
          422,
        );
      }
    }
  }

  await connectMongo();
  const existingPage = await Page.findOne({ slug }).lean();
  if (!existingPage) {
    return jsonError("not_found", "Page not found", 404);
  }

  if (normalizedSlug !== undefined && normalizedSlug !== slug) {
    const conflictingPage = await Page.findOne({ slug: normalizedSlug }).lean();
    if (conflictingPage) {
      return jsonError("validation_error", "Slug is already in use", 422);
    }
  }

  const update: Record<string, unknown> = {};
  if (parsed.data.title !== undefined) update.title = parsed.data.title;
  if (normalizedSlug !== undefined) update.slug = normalizedSlug;
  if (parsed.data.status !== undefined) update.status = parsed.data.status;
  if (normalizedSections !== undefined) update.sections = normalizedSections;
  if (parsed.data.seoTitle !== undefined) update.seoTitle = parsed.data.seoTitle;
  if (parsed.data.seoDescription !== undefined)
    update.seoDescription = parsed.data.seoDescription;
  if (parsed.data.ogImage !== undefined) update.ogImage = parsed.data.ogImage;
  if (parsed.data.canonicalPath !== undefined)
    update.canonicalPath = parsed.data.canonicalPath;

  const page = await Page.findOneAndUpdate({ slug }, { $set: update }, { new: true }).lean();
  if (!page) {
    return jsonError("not_found", "Page not found", 404);
  }

  const oldHref = slugToHref(existingPage.slug);
  const newHref = slugToHref(page.slug);
  const titleChanged =
    parsed.data.title !== undefined && parsed.data.title !== existingPage.title;
  const slugChanged = page.slug !== existingPage.slug;

  if (titleChanged || slugChanged) {
    const siteGlobal = await SiteGlobal.findOne({ key: "default" });
    if (siteGlobal && Array.isArray(siteGlobal.navItems)) {
      siteGlobal.navItems = siteGlobal.navItems.map((item: unknown) => {
        if (!item || typeof item !== "object") return item;

        const navItem = item as { label?: string; href?: string };
        if (navItem.href !== oldHref) {
          return item;
        }

        return {
          ...navItem,
          href: slugChanged ? newHref : navItem.href,
          label: titleChanged ? page.title : navItem.label,
        };
      });
      await siteGlobal.save();
    }
    revalidateSiteGlobal();
  }

  revalidatePage(slug, page.sections as PageSection[]);
  if (page.slug !== slug) {
    revalidatePage(page.slug, page.sections as PageSection[]);
  }
  return jsonData(page);
}
