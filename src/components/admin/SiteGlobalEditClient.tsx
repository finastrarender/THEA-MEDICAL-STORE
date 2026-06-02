"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ContactHqIconPicker from "@/components/admin/ContactHqIconPicker";
import {
  defaultHeaderActions,
  defaultFooterColumns,
  defaultFooterMeta,
  defaultNavItems,
} from "@/data/site-defaults";
import { normalizeSitePath } from "@/lib/site-path";
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

const DEFAULT_LINK_COLUMN = defaultFooterColumns.find(isLinkColumn) as FooterLinkColumn;
const DEFAULT_CONTACT_COLUMN = defaultFooterColumns.find(isContactColumn) as FooterContactColumn;

function getPageHref(page: PageSummary) {
  return page.slug === "home" ? "/" : `/${page.slug}`;
}

function parseFooterColumns(columns: FooterColumn[]) {
  const linkColumn = columns.find(isLinkColumn);
  const contactColumn = columns.find(isContactColumn);

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
  const [footerCopyright, setFooterCopyright] = useState(defaultFooterMeta.copyright);
  const [footerCtaLabel, setFooterCtaLabel] = useState("REQUEST CREDENTIALS");
  const [footerCtaHref, setFooterCtaHref] = useState("/contact");
  const [headerContactLabel, setHeaderContactLabel] = useState(defaultHeaderActions.contactLabel);
  const [headerInquireLabel, setHeaderInquireLabel] = useState(defaultHeaderActions.inquireLabel);
  const [headerInquireHref, setHeaderInquireHref] = useState(defaultHeaderActions.inquireHref);

  const [seoDefaultTitle, setSeoDefaultTitle] = useState("CRYPTONEXIS LIMITED");
  const [seoDefaultDescription, setSeoDefaultDescription] = useState(
    "Cryptonexis Limited — RAK Economic Zone licensed NFT creator and issuer for institutional digital assets in the UAE.",
  );
  const [clientLogosFlag, setClientLogosFlag] = useState(true);
  const [preservedLegal, setPreservedLegal] = useState(defaultFooterMeta.legal);

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

        setHeaderBrand(
          (d.headerBrand as string) ??
            (d.footerMeta?.brand as string) ??
            defaultFooterMeta.brand,
        );
        setNavItems((d.navItems as NavItem[]) ?? defaultNavItems);
        setPages((pagesJson.data ?? []) as PageSummary[]);
        setFooterBrand((d.footerMeta?.brand as string) ?? defaultFooterMeta.brand);
        setFooterDescription(
          (d.footerMeta?.description as string) ?? defaultFooterMeta.description,
        );
        setLinkColumnTitle(footer.linkColumnTitle);
        setLinkColumnLinks(footer.linkColumnLinks);
        setContactColumnTitle(footer.contactColumnTitle);
        setContactRows(footer.contactRows);
        setFooterCopyright(
          (d.footerMeta?.copyright as string) ?? defaultFooterMeta.copyright,
        );
        setFooterCtaLabel((d.footerMeta?.ctaLabel as string) ?? "REQUEST CREDENTIALS");
        setFooterCtaHref((d.footerMeta?.ctaHref as string) ?? "/contact");
        setHeaderContactLabel(
          (d.headerActions?.contactLabel as string) ?? defaultHeaderActions.contactLabel,
        );
        setHeaderInquireLabel(
          (d.headerActions?.inquireLabel as string) ?? defaultHeaderActions.inquireLabel,
        );
        setHeaderInquireHref(
          (d.headerActions?.inquireHref as string) ?? defaultHeaderActions.inquireHref,
        );
        setPreservedLegal(
          (d.footerMeta?.legal as typeof defaultFooterMeta.legal) ?? defaultFooterMeta.legal,
        );

        setClientLogosFlag(d.featureFlags?.clientLogos !== false);
        setSeoDefaultTitle(
          d.seoDefaults?.defaultTitle ?? "CRYPTONEXIS LIMITED",
        );
        setSeoDefaultDescription(
          d.seoDefaults?.defaultDescription ??
            "Cryptonexis Limited — RAK Economic Zone licensed NFT creator and issuer for institutional digital assets in the UAE.",
        );
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

  async function onSave(e: React.FormEvent) {
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
      headerActions: {
        contactLabel: headerContactLabel.trim() || defaultHeaderActions.contactLabel,
        inquireLabel: headerInquireLabel.trim() || defaultHeaderActions.inquireLabel,
        inquireHref: headerInquireHref.trim() || defaultHeaderActions.inquireHref,
      },
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
              Brand title
              <input
                value={headerBrand}
                onChange={(e) => setHeaderBrand(e.target.value)}
                placeholder="CRYPTONEXIS LIMITED"
              />
            </label>

            <h3 style={{ marginBottom: 8 }}>Navigation links</h3>
            {navItems.map((item, index) => (
              <div key={index} className="admin-section-card">
                <label>
                  Page route
                  <select
                    value={
                      pages.some(
                        (page) => getPageHref(page) === item.href,
                      )
                        ? item.href
                        : ""
                    }
                    onChange={(e) => {
                      if (!e.target.value) return;
                      updateNav(index, "href", e.target.value);
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
                  Link label
                  <input
                    value={item.label}
                    onChange={(e) => updateNav(index, "label", e.target.value)}
                    placeholder="Home"
                  />
                </label>
                <label>
                  URL
                  <input
                    value={item.href}
                    onChange={(e) => updateNav(index, "href", e.target.value)}
                    placeholder="/about"
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

            <div className="admin-section-card" style={{ marginTop: 16 }}>
              <h3 style={{ margin: "0 0 12px" }}>Header actions</h3>
              <p className="admin-muted" style={{ margin: "0 0 12px" }}>
                These actions appear in the header on all pages (same as Home).
              </p>
              <label>
                Contact label
                <input
                  value={headerContactLabel}
                  onChange={(e) => setHeaderContactLabel(e.target.value)}
                  placeholder="Contact Us"
                />
              </label>
              <label>
                Inquire button label
                <input
                  value={headerInquireLabel}
                  onChange={(e) => setHeaderInquireLabel(e.target.value)}
                  placeholder="Inquire"
                />
              </label>
              <label>
                Inquire button URL
                <input
                  value={headerInquireHref}
                  onChange={(e) => setHeaderInquireHref(e.target.value)}
                  placeholder="/contact?apply=1"
                />
              </label>
            </div>
          </div>

          <div className="admin-section-group">
            <h2>Footer</h2>
            <p className="admin-muted" style={{ marginTop: 0 }}>
              Matches the site footer: brand column, link column, contact column, copyright, and CTA
              button.
            </p>

            <label>
              Brand name
              <input
                value={footerBrand}
                onChange={(e) => setFooterBrand(e.target.value)}
                placeholder="CRYPTONEXIS LIMITED"
              />
            </label>
            <label>
              Brand description
              <textarea
                rows={3}
                value={footerDescription}
                onChange={(e) => setFooterDescription(e.target.value)}
              />
            </label>

            <div className="admin-section-card">
              <h3 style={{ margin: "0 0 12px" }}>Link column</h3>
              <p className="admin-muted" style={{ margin: "0 0 12px" }}>
                Middle footer column — page links (Home, About Us, Service, NFT Projects, Contact
                Us).
              </p>
              <label>
                Column heading
                <input
                  value={linkColumnTitle}
                  onChange={(e) => setLinkColumnTitle(e.target.value)}
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
                    Link label
                    <input
                      value={link.label}
                      onChange={(e) => updateFooterLink(index, "label", e.target.value)}
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
                Column heading
                <input
                  value={contactColumnTitle}
                  onChange={(e) => setContactColumnTitle(e.target.value)}
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
                    {row.type === "location"
                      ? "Address"
                      : row.type === "mail"
                        ? "Email address"
                        : "Phone number"}
                    <textarea
                      rows={row.type === "location" ? 3 : 2}
                      value={row.value}
                      onChange={(e) => updateContactRow(index, "value", e.target.value)}
                      placeholder={
                        row.type === "location"
                          ? "RAK Economic Zone, Building 4, Ras Al Khaimah, United Arab Emirates"
                          : row.type === "mail"
                            ? "inquiry@cryptonexis.com"
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
                  Button label
                  <input
                    value={footerCtaLabel}
                    onChange={(e) => setFooterCtaLabel(e.target.value)}
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

            <label>
              Copyright line
              <input
                value={footerCopyright}
                onChange={(e) => setFooterCopyright(e.target.value)}
                placeholder="© 2024 CRYPTONEXIS LIMITED. UAE REGULATED. RAK ECONOMIC ZONE."
              />
            </label>
          </div>

          <div className="admin-section-group">
            <h2>SEO defaults</h2>
            <p className="admin-muted" style={{ marginTop: 0 }}>
              Used when a page has no custom SEO title or description.
            </p>
            <label>
              Default SEO title
              <input value={seoDefaultTitle} onChange={(e) => setSeoDefaultTitle(e.target.value)} />
            </label>
            <label>
              Default SEO description
              <textarea
                rows={3}
                value={seoDefaultDescription}
                onChange={(e) => setSeoDefaultDescription(e.target.value)}
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
