"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import ContactHqIconPicker from "@/components/admin/ContactHqIconPicker";
import {
  defaultHeaderActions,
  defaultFooterColumns,
  defaultFooterMeta,
  defaultNavItems,
  defaultSeoDefaults,
} from "@/data/site-defaults";
import CharacterCount from "@/components/admin/CharacterCount";
import { normalizeSitePath } from "@/lib/site-path";
import { siteGlobalLimits } from "@/lib/seeded-lengths";
import type { FooterColumn } from "@/components/layout/SiteFooter";

type NavItem = { label: string; href: string };
type PageSummary = { slug: string; title: string };
type FooterLink = { label: string; href: string };
type ContactRow = { type: "location" | "phone" | "mail"; value: string };
type FooterLinkColumn = { title: string; links: FooterLink[] };
type FooterContactColumn = { title: string; contact: ContactRow[] };

function isLinkColumn(column: FooterColumn): column is FooterLinkColumn {
  return "links" in column;
}

function isContactColumn(column: FooterColumn): column is FooterContactColumn {
  return "contact" in column;
}

function isBodyColumn(column: FooterColumn): column is { title: string; body: string } {
  return "body" in column;
}

const DEFAULT_LINK_COLUMN = defaultFooterColumns.find(isLinkColumn) as FooterLinkColumn;
const DEFAULT_CONTACT_COLUMN = defaultFooterColumns.find(isContactColumn) as FooterContactColumn;
const DEFAULT_BODY_COLUMN = defaultFooterColumns.find(isBodyColumn) as { title: string; body: string };

function getPageHref(page: PageSummary) {
  return page.slug === "home" ? "/" : `/${page.slug}`;
}

function parseFooterColumns(columns: FooterColumn[]) {
  const linkColumn = columns.find(isLinkColumn);
  const contactColumn = columns.find(isContactColumn);
  const bodyColumn = columns.find(isBodyColumn);

  const storedLinks = linkColumn?.links ?? [];
  const validLinks = storedLinks.filter((link) => link.label?.trim() || link.href?.trim());

  const storedContacts = contactColumn?.contact ?? [];
  const validContacts = storedContacts.filter((row) => row.value?.trim());

  return {
    linkColumnTitle: linkColumn?.title?.trim() || DEFAULT_LINK_COLUMN.title,
    linkColumnLinks:
      validLinks.length > 0 ? storedLinks : [...DEFAULT_LINK_COLUMN.links],
    contactColumnTitle:
      contactColumn?.title?.trim() || DEFAULT_CONTACT_COLUMN.title,
    contactRows:
      validContacts.length > 0 ? storedContacts : [...DEFAULT_CONTACT_COLUMN.contact],
    bodyColumnTitle:
      bodyColumn?.title?.trim() || DEFAULT_BODY_COLUMN.title,
    bodyColumnBody:
      bodyColumn?.body?.trim() || DEFAULT_BODY_COLUMN.body,
  };
}

export default function SiteGlobalEditClient() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [headerBrand, setHeaderBrand] = useState("THEA Medical Store");
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [footerBrand, setFooterBrand] = useState(defaultFooterMeta.brand);
  const [footerDescription, setFooterDescription] = useState(defaultFooterMeta.description);
  const [linkColumnTitle, setLinkColumnTitle] = useState(DEFAULT_LINK_COLUMN.title);
  const [linkColumnLinks, setLinkColumnLinks] = useState<FooterLink[]>([
    ...DEFAULT_LINK_COLUMN.links,
  ]);
  const [contactColumnTitle, setContactColumnTitle] = useState(DEFAULT_CONTACT_COLUMN.title);
  const [contactRows, setContactRows] = useState<ContactRow[]>([
    ...DEFAULT_CONTACT_COLUMN.contact,
  ]);
  const [complianceColumnTitle, setComplianceColumnTitle] = useState(DEFAULT_BODY_COLUMN.title);
  const [complianceColumnBody, setComplianceColumnBody] = useState(DEFAULT_BODY_COLUMN.body);
  const [footerCopyright, setFooterCopyright] = useState(defaultFooterMeta.copyright);
  const [footerCtaLabel, setFooterCtaLabel] = useState("REQUEST CREDENTIALS");
  const [footerCtaHref, setFooterCtaHref] = useState("/contact");

  const [seoDefaultTitle, setSeoDefaultTitle] = useState(defaultSeoDefaults.defaultTitle);
  const [seoDefaultDescription, setSeoDefaultDescription] = useState(
    defaultSeoDefaults.defaultDescription,
  );
  const [clientLogosFlag, setClientLogosFlag] = useState(true);
  const [preservedLegal, setPreservedLegal] = useState(defaultFooterMeta.legal);

  const [limits, setLimits] = useState(siteGlobalLimits);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/v1/admin/site-global");
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error?.message ?? "Load failed");
        const pagesRes = await fetch("/api/v1/admin/pages");
        const pagesJson = await pagesRes.json();
        if (!pagesRes.ok) throw new Error(pagesJson?.error?.message ?? "Failed to load pages");
        const d = json.data;
        if (cancelled) return;

        const footer = parseFooterColumns(
          (d.footerColumns as FooterColumn[] | undefined) ?? defaultFooterColumns,
        );

        const currentHeaderBrand = (d.headerBrand as string) ??
            (d.footerMeta?.brand as string) ??
            defaultFooterMeta.brand;
        const currentNavItems = (d.navItems as NavItem[]) ?? defaultNavItems;
        const currentFooterBrand = (d.footerMeta?.brand as string) ?? defaultFooterMeta.brand;
        const currentFooterDescription = (d.footerMeta?.description as string) ?? defaultFooterMeta.description;
        const currentCopyright = (d.footerMeta?.copyright as string) ?? defaultFooterMeta.copyright;
        const currentCtaLabel = (d.footerMeta?.ctaLabel as string) ?? "REQUEST CREDENTIALS";
        const currentSeoTitle = d.seoDefaults?.defaultTitle ?? defaultSeoDefaults.defaultTitle;
        const currentSeoDescription = d.seoDefaults?.defaultDescription ?? defaultSeoDefaults.defaultDescription;

        setHeaderBrand(currentHeaderBrand);
        setNavItems(currentNavItems);
        setPages((pagesJson.data ?? []) as PageSummary[]);
        setFooterBrand(currentFooterBrand);
        setFooterDescription(currentFooterDescription);
        setLinkColumnTitle(footer.linkColumnTitle);
        setLinkColumnLinks(footer.linkColumnLinks);
        setContactColumnTitle(footer.contactColumnTitle);
        setContactRows(footer.contactRows);
        setComplianceColumnTitle(footer.bodyColumnTitle);
        setComplianceColumnBody(footer.bodyColumnBody);
        setFooterCopyright(currentCopyright);
        setFooterCtaLabel(currentCtaLabel);
        setFooterCtaHref((d.footerMeta?.ctaHref as string) ?? "/contact");
        setPreservedLegal(
          (d.footerMeta?.legal as typeof defaultFooterMeta.legal) ?? defaultFooterMeta.legal,
        );

        setClientLogosFlag(d.featureFlags?.clientLogos !== false);
        setSeoDefaultTitle(currentSeoTitle);
        setSeoDefaultDescription(currentSeoDescription);

        setLimits({
          headerBrand: Math.max(siteGlobalLimits.headerBrand, currentHeaderBrand.length),
          navLabel: Math.max(siteGlobalLimits.navLabel, currentNavItems.reduce((max, item) => Math.max(max, item.label.length), 0)),
          footerBrand: Math.max(siteGlobalLimits.footerBrand, currentFooterBrand.length),
          footerDescription: Math.max(siteGlobalLimits.footerDescription, currentFooterDescription.length),
          footerCopyright: Math.max(siteGlobalLimits.footerCopyright, currentCopyright.length),
          footerCtaLabel: Math.max(siteGlobalLimits.footerCtaLabel, currentCtaLabel.length),
          seoTitle: Math.max(siteGlobalLimits.seoTitle, currentSeoTitle.length),
          seoDescription: Math.max(siteGlobalLimits.seoDescription, currentSeoDescription.length),
          linkColumnTitle: Math.max(siteGlobalLimits.linkColumnTitle, (footer.linkColumnTitle ?? "").length),
          contactColumnTitle: Math.max(siteGlobalLimits.contactColumnTitle, (footer.contactColumnTitle ?? "").length),
          complianceColumnTitle: Math.max(siteGlobalLimits.complianceColumnTitle, (footer.bodyColumnTitle ?? "").length),
          complianceColumnBody: Math.max(siteGlobalLimits.complianceColumnBody, (d.footerMeta?.complianceBody as string ?? "").length),
        });

        // Character limits are now handled by siteGlobalLimits registry
      } catch (e) {
        if (!cancelled) setMessage(e instanceof Error ? e.message : "Load error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function updateNav(index: number, field: keyof NavItem, value: string) {
    setNavItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addNavItem() {
    setNavItems((prev) => [...prev, { label: "", href: "" }]);
  }

  function removeNavItem(index: number) {
    setNavItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }

  function updateFooterLink(index: number, field: keyof FooterLink, value: string) {
    setLinkColumnLinks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addFooterLink() {
    setLinkColumnLinks((prev) => [...prev, { label: "", href: "" }]);
  }

  function removeFooterLink(index: number) {
    setLinkColumnLinks((prev) => {
      const next = prev.filter((_, itemIndex) => itemIndex !== index);
      return next.length > 0 ? next : [{ label: "", href: "" }];
    });
  }

  function updateContactRow(index: number, field: keyof ContactRow, value: string) {
    setContactRows((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: field === "type" ? (value as ContactRow["type"]) : value,
      };
      return next;
    });
  }

  function addContactRow() {
    setContactRows((prev) => [...prev, { type: "location", value: "" }]);
  }

  function removeContactRow(index: number) {
    setContactRows((prev) => {
      const next = prev.filter((_, itemIndex) => itemIndex !== index);
      return next.length > 0 ? next : [{ type: "location", value: "" }];
    });
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const body = {
      headerBrand: headerBrand.trim(),
      navItems: navItems
        .map((item) => ({
          label: item.label.trim(),
          href: normalizeSitePath(item.href, "/"),
        }))
        .filter((item) => item.label && item.href),
      footerColumns: [
        {
          title: linkColumnTitle.trim() || "LINK",
          links: linkColumnLinks
            .map((link) => ({
              label: link.label.trim(),
              href: normalizeSitePath(link.href, "/"),
            }))
            .filter((link) => link.label && link.href),
        },
        {
          title: contactColumnTitle.trim() || "CONTACT INFO",
          contact: contactRows
            .map((row) => ({
              type: row.type,
              value: row.value.trim(),
            }))
            .filter((row) => row.value),
        },
        {
          title: complianceColumnTitle.trim() || "Compliance",
          body: complianceColumnBody.trim(),
        },
      ],
      footerMeta: {
        brand: footerBrand.trim(),
        description: footerDescription.trim(),
        social: [],
        copyright: footerCopyright.trim(),
        legal: preservedLegal,
        ctaLabel: footerCtaLabel.trim() || "REQUEST CREDENTIALS",
        ctaHref: footerCtaHref.trim() || "/contact",
      },
      seoDefaults: {
        defaultTitle: seoDefaultTitle.trim() || undefined,
        defaultDescription: seoDefaultDescription.trim() || undefined,
      },
      featureFlags: { clientLogos: clientLogosFlag },
    };

    try {
      const res = await fetch("/api/v1/admin/site-global", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? "Save failed");
      setMessage("Saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="admin-muted">Loading…</p>;

  return (
    <div className="admin-shell">
      <nav className="admin-nav">
        <Link href="/admin">← Dashboard</Link>
      </nav>
      <div className="admin-card">
        <h1 style={{ marginTop: 0 }}>Site global</h1>
        <p className="admin-muted">
          Edit the site header and footer shown on every marketing page.
        </p>

        <form className="admin-form admin-section-form" onSubmit={onSave}>
          <div className="admin-section-group">
            <h2>Header</h2>
            <p className="admin-muted" style={{ marginTop: 0 }}>
              Text brand on the left and navigation links on the right, matching the live site header.
            </p>

            <label>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                Brand title
                <CharacterCount current={headerBrand.length} max={limits.headerBrand} warningAt={limits.headerBrand - 5} />
              </div>
              <input
                value={headerBrand}
                onChange={(e) => setHeaderBrand(e.target.value)}
                maxLength={limits.headerBrand}
                placeholder="THEA Medical Store"
              />
            </label>

            <h3 style={{ marginBottom: 8 }}>Navigation links</h3>
            {navItems.map((item, index) => (
              <div key={index} className="admin-section-card">
                <label>
                  <span className="admin-field-label">Page link (Quick fill)</span>
                  <select
                    value={
                      pages.some((page) => getPageHref(page) === item.href) ? item.href : ""
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;
                      const page = pages.find((p) => getPageHref(p) === val);
                      setNavItems((prev) => {
                        const next = [...prev];
                        next[index] = {
                          ...next[index],
                          href: val,
                          label: next[index].label.trim() === "" ? (page?.title ?? "") : next[index].label,
                        };
                        return next;
                      });
                    }}
                  >
                    <option value="">Select an existing page…</option>
                    {pages.map((page) => {
                      const href = getPageHref(page);
                      return (
                        <option key={page.slug} value={href}>
                          {page.title} ({href})
                        </option>
                      );
                    })}
                  </select>
                </label>
                <label>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    Link text
                    <CharacterCount
                      current={item.label.length}
                      max={limits.navLabel}
                      warningAt={limits.navLabel - 5}
                    />
                  </div>
                  <input
                    value={item.label}
                    onChange={(e) => updateNav(index, "label", e.target.value)}
                    maxLength={limits.navLabel}
                    placeholder="e.g. Services"
                  />
                </label>
                <label>
                  URL path (manual override)
                  <input
                    value={item.href}
                    onChange={(e) => updateNav(index, "href", e.target.value)}
                    placeholder="e.g. /services"
                  />
                </label>
                <button
                  type="button"
                  className="admin-button-secondary"
                  onClick={() => removeNavItem(index)}
                >
                  Remove link
                </button>
              </div>
            ))}
            <button type="button" className="admin-button-secondary" onClick={addNavItem}>
              Add navigation link
            </button>

            <hr />
          </div>

          <div className="admin-section-group">
            <h2>Footer</h2>
            <p className="admin-muted" style={{ marginTop: 0 }}>
              Matches the site footer: brand column, link column, contact column, copyright, and CTA
              button.
            </p>

            <label>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                Brand name
                <CharacterCount current={footerBrand.length} max={limits.footerBrand} warningAt={limits.footerBrand - 10} />
              </div>
              <input
                value={footerBrand}
                onChange={(e) => setFooterBrand(e.target.value)}
                maxLength={limits.footerBrand}
                placeholder="THEA Medical Store"
              />
            </label>
            <label>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                Brand description
                <CharacterCount current={footerDescription.length} max={limits.footerDescription} warningAt={limits.footerDescription - 50} />
              </div>
              <textarea
                rows={3}
                value={footerDescription}
                onChange={(e) => setFooterDescription(e.target.value)}
                maxLength={limits.footerDescription}
              />
            </label>

            <div className="admin-section-card">
              <h3 style={{ margin: "0 0 12px" }}>Link column</h3>
              <p className="admin-muted" style={{ margin: "0 0 12px" }}>
                Middle footer column — page links (Home, About, Services, Products, etc).
              </p>
              <label>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  Column heading
                  <CharacterCount current={linkColumnTitle.length} max={limits.linkColumnTitle} warningAt={limits.linkColumnTitle - 5} />
                </div>
                <input
                  value={linkColumnTitle}
                  onChange={(e) => setLinkColumnTitle(e.target.value)}
                  maxLength={limits.linkColumnTitle}
                  placeholder="LINK"
                />
              </label>
              {linkColumnLinks.map((link, index) => (
                <div key={index} className="admin-section-card" style={{ marginTop: 12 }}>
                  <h4 style={{ margin: "0 0 8px" }}>Link {index + 1}</h4>
                  <label>
                    Page route
                    <select
                      value={
                        pages.some((page) => getPageHref(page) === link.href) ? link.href : ""
                      }
                      onChange={(e) => {
                        if (!e.target.value) return;
                        updateFooterLink(index, "href", e.target.value);
                      }}
                    >
                      <option value="">Select page…</option>
                      {pages.map((page) => {
                        const href = getPageHref(page);
                        return (
                          <option key={page.slug} value={href}>
                            {page.title} ({href})
                          </option>
                        );
                      })}
                    </select>
                  </label>
                  <label>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      Link label
                      <CharacterCount
                        current={link.label.length}
                        max={limits.navLabel}
                        warningAt={limits.navLabel - 5}
                      />
                    </div>
                    <input
                      value={link.label}
                      onChange={(e) => updateFooterLink(index, "label", e.target.value)}
                      maxLength={limits.navLabel}
                      placeholder="Home"
                    />
                  </label>
                  <label>
                    Link URL
                    <input
                      value={link.href}
                      onChange={(e) => updateFooterLink(index, "href", e.target.value)}
                      placeholder="/"
                    />
                  </label>
                  <button
                    type="button"
                    className="admin-button-secondary"
                    onClick={() => removeFooterLink(index)}
                    disabled={linkColumnLinks.length === 1}
                  >
                    Remove link
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="admin-button-secondary"
                onClick={addFooterLink}
                style={{ marginTop: 12 }}
              >
                Add footer link
              </button>
              <button
                type="button"
                className="admin-button-secondary"
                style={{ marginTop: 8, marginLeft: 8 }}
                onClick={() => {
                  setLinkColumnTitle(DEFAULT_LINK_COLUMN.title);
                  setLinkColumnLinks([...DEFAULT_LINK_COLUMN.links]);
                }}
              >
                Reset links to defaults
              </button>
            </div>

            <div className="admin-section-card">
              <h3 style={{ margin: "0 0 12px" }}>Contact column</h3>
              <p className="admin-muted" style={{ margin: "0 0 12px" }}>
                Right footer column — address, email, and the request credentials button.
              </p>
              <label>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  Column heading
                  <CharacterCount current={contactColumnTitle.length} max={limits.contactColumnTitle} warningAt={limits.contactColumnTitle - 5} />
                </div>
                <input
                  value={contactColumnTitle}
                  onChange={(e) => setContactColumnTitle(e.target.value)}
                  maxLength={limits.contactColumnTitle}
                  placeholder="CONTACT INFO"
                />
              </label>
              {contactRows.map((row, index) => (
                <div key={index} className="admin-section-card" style={{ marginTop: 12 }}>
                  <h4 style={{ margin: "0 0 8px" }}>
                    {row.type === "location"
                      ? "Address"
                      : row.type === "mail"
                        ? "Email"
                        : row.type === "phone"
                          ? "Phone"
                          : `Contact line ${index + 1}`}
                  </h4>
                  <div>
                    <span className="admin-field-label">Icon</span>
                    <ContactHqIconPicker
                      value={row.type}
                      onChange={(value) => {
                        if (value === "location" || value === "mail" || value === "phone") {
                          updateContactRow(index, "type", value);
                        }
                      }}
                    />
                  </div>
                  <label>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      {row.type === "location"
                        ? "Address"
                        : row.type === "mail"
                          ? "Email address"
                          : "Phone number"}
                      <CharacterCount
                        current={row.value.length}
                        max={row.type === "location" ? 150 : 60}
                        warningAt={(row.type === "location" ? 150 : 60) - 20}
                      />
                    </div>
                    <textarea
                      rows={row.type === "location" ? 3 : 2}
                      value={row.value}
                      onChange={(e) => updateContactRow(index, "value", e.target.value)}
                      maxLength={row.type === "location" ? 150 : 60}
                      placeholder={
                        row.type === "location"
                          ? "RAK Economic Zone, Building 4, Ras Al Khaimah, United Arab Emirates"
                          : row.type === "mail"
                            ? "inquiry@thea.com"
                            : "+971 (0) 7 204 1111"
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className="admin-button-secondary"
                    onClick={() => removeContactRow(index)}
                    disabled={contactRows.length === 1}
                  >
                    Remove contact line
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="admin-button-secondary"
                onClick={addContactRow}
                style={{ marginTop: 12 }}
              >
                Add contact line
              </button>
              <button
                type="button"
                className="admin-button-secondary"
                style={{ marginTop: 8, marginLeft: 8 }}
                onClick={() => {
                  setContactColumnTitle(DEFAULT_CONTACT_COLUMN.title);
                  setContactRows([...DEFAULT_CONTACT_COLUMN.contact]);
                }}
              >
                Reset contact to defaults
              </button>

              <div
                className="admin-section-card"
                style={{ marginTop: 16, background: "#f8fafc" }}
              >
                <h4 style={{ margin: "0 0 12px" }}>Request credentials button</h4>
                <label>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    Button label
                    <CharacterCount current={footerCtaLabel.length} max={limits.footerCtaLabel} warningAt={limits.footerCtaLabel - 5} />
                  </div>
                  <input
                    value={footerCtaLabel}
                    onChange={(e) => setFooterCtaLabel(e.target.value)}
                    maxLength={limits.footerCtaLabel}
                    placeholder="REQUEST CREDENTIALS"
                  />
                </label>
                <label>
                  Button URL
                  <input
                    value={footerCtaHref}
                    onChange={(e) => setFooterCtaHref(e.target.value)}
                    placeholder="/contact"
                  />
                </label>
              </div>
            </div>

            <div className="admin-section-card">
              <h3 style={{ margin: "0 0 12px" }}>Compliance column</h3>
              <p className="admin-muted" style={{ margin: "0 0 12px" }}>
                Right-most footer column — regulatory compliance and licensing text.
              </p>
              <label>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  Column heading
                  <CharacterCount current={complianceColumnTitle.length} max={limits.complianceColumnTitle} warningAt={limits.complianceColumnTitle - 5} />
                </div>
                <input
                  value={complianceColumnTitle}
                  onChange={(e) => setComplianceColumnTitle(e.target.value)}
                  maxLength={limits.complianceColumnTitle}
                  placeholder="Compliance"
                />
              </label>
              <label>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  Compliance body text
                  <CharacterCount current={complianceColumnBody.length} max={limits.complianceColumnBody} warningAt={limits.complianceColumnBody - 50} />
                </div>
                <textarea
                  rows={4}
                  value={complianceColumnBody}
                  onChange={(e) => setComplianceColumnBody(e.target.value)}
                  maxLength={limits.complianceColumnBody}
                  placeholder="Regulatory Compliance: MOHAP Certified..."
                />
              </label>
              <button
                type="button"
                className="admin-button-secondary"
                style={{ marginTop: 8 }}
                onClick={() => {
                  setComplianceColumnTitle(DEFAULT_BODY_COLUMN.title);
                  setComplianceColumnBody(DEFAULT_BODY_COLUMN.body);
                }}
              >
                Reset compliance to defaults
              </button>
            </div>

            <label>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                Copyright line
                <CharacterCount current={footerCopyright.length} max={limits.footerCopyright} warningAt={limits.footerCopyright - 30} />
              </div>
              <input
                value={footerCopyright}
                onChange={(e) => setFooterCopyright(e.target.value)}
                maxLength={limits.footerCopyright}
                placeholder="© 2024 THEA Medical Store. All rights reserved."
              />
            </label>
          </div>

          <div className="admin-section-group">
            <h2>SEO defaults</h2>
            <p className="admin-muted" style={{ marginTop: 0 }}>
              Used when a page has no custom SEO title or description.
            </p>
            <label>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                Default SEO title
                <CharacterCount current={seoDefaultTitle.length} max={limits.seoTitle} warningAt={limits.seoTitle - 10} />
              </div>
              <input
                value={seoDefaultTitle}
                onChange={(e) => setSeoDefaultTitle(e.target.value)}
                maxLength={limits.seoTitle}
                placeholder={defaultSeoDefaults.defaultTitle}
              />
            </label>
            <label>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                Default SEO description
                <CharacterCount current={seoDefaultDescription.length} max={limits.seoDescription} warningAt={limits.seoDescription - 10} />
              </div>
              <textarea
                rows={3}
                value={seoDefaultDescription}
                onChange={(e) => setSeoDefaultDescription(e.target.value)}
                maxLength={limits.seoDescription}
                placeholder={defaultSeoDefaults.defaultDescription}
              />
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={clientLogosFlag}
                onChange={(e) => setClientLogosFlag(e.target.checked)}
              />
              Show client logos section when present on a page
            </label>
          </div>

          <button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save site global"}
          </button>
          {message ? (
            <p className={message === "Saved." ? "contact-form__ok" : "contact-form__err"}>
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
