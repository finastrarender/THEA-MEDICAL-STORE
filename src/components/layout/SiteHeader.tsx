"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { normalizeSitePath } from "@/lib/site-path";
import { scrollToHash, scrollToNavTarget } from "@/lib/scroll-navigation";
import { defaultHeaderActions } from "@/data/site-defaults";

export type NavItem = { label: string; href: string; active?: boolean };

function isActive(pathname: string, href: string) {
  const path = href.split("#")[0] || "/";
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

function handleInPageNavClick(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
  pathname: string,
  onNavigate?: () => void,
) {
  const url = new URL(href, window.location.origin);
  const targetPath = url.pathname || "/";
  const samePage =
    targetPath === pathname ||
    (targetPath === "/" && pathname === "/");

  if (!samePage) {
    onNavigate?.();
    return;
  }

  event.preventDefault();
  onNavigate?.();

  if (url.hash) {
    scrollToHash(url.hash);
    return;
  }

  scrollToNavTarget(targetPath);
}

const CENTER_NAV = [
  { keys: ["home"], href: "/", label: "Home" },
  { keys: ["services", "service"], href: "/services", label: "Services" },
  { keys: ["products", "product"], href: "/products", label: "Products" },
  { keys: ["clients", "client"], href: "/clients", label: "Clients" },
  { keys: ["about", "about us"], href: "/about", label: "About" },
] as const;

export default function SiteHeader({
  navItems,
  brandTitle = "THEA Medical Store",
  contactHref = "/contact",
  headerActions,
}: {
  navItems: NavItem[];
  brandTitle?: string;
  contactHref?: string;
  headerActions?: {
    contactLabel?: string;
    inquireLabel?: string;
    inquireHref?: string;
  };
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMenuOpen]);

  const validNavItems = navItems.filter(
    (item): item is { label: string; href: string; active?: boolean } =>
      typeof item?.href === "string" &&
      item.href.trim() !== "" &&
      typeof item?.label === "string" &&
      item.label.trim() !== "",
  );

  const displayNavItems = CENTER_NAV.map(({ keys, href, label }) => {
    const found = validNavItems.find((item) =>
      (keys as readonly string[]).includes(item.label.trim().toLowerCase()),
    );
    if (found) {
      return {
        label: found.label.trim() || label,
        href: normalizeSitePath(found.href, href),
      };
    }
    return { label, href };
  });

  const contactLink = normalizeSitePath(
    validNavItems.find((item) =>
      ["contact", "contact us"].includes(item.label.trim().toLowerCase()),
    )?.href ?? contactHref,
    "/contact",
  );

  const brand = brandTitle.trim() || "THEA Medical Store";
  const contactLabel =
    headerActions?.contactLabel?.trim() || defaultHeaderActions.contactLabel;
  const navItemsWithContact = [...displayNavItems];
  const hasContactLink = navItemsWithContact.some(
    (item) =>
      item.href === contactLink || item.label.trim().toLowerCase() === contactLabel.trim().toLowerCase(),
  );
  if (!hasContactLink) {
    navItemsWithContact.push({ label: contactLabel, href: contactLink });
  }

  return (
    <header className="site-header site-header--institutional site-header--thea">
      <div className="site-header__shell section-shell">
        <div className="site-header__inner">
          <Link
            className="brand"
            href="/"
            aria-label={`${brand} home`}
            onClick={(event) => handleInPageNavClick(event, "/", pathname)}
          >
            <span className="brand__title">{brand}</span>
          </Link>

          <nav
            className={`site-nav site-nav--institutional site-nav--center${isMenuOpen ? " is-open" : ""}`}
            id="site-navigation"
            aria-label="Primary"
          >
            {navItemsWithContact.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.label}
                  className={`site-nav__link${active ? " site-nav__link--active" : ""}`}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={(event) =>
                    handleInPageNavClick(event, item.href, pathname, () => setIsMenuOpen(false))
                  }
                >
                  {item.label}
                  {active ? (
                    <span className="site-nav__underline" aria-hidden="true" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="site-header__actions">
            <button
              suppressHydrationWarning
              className={`menu-toggle menu-toggle--institutional${isMenuOpen ? " is-open" : ""}`}
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="site-navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <span className="menu-toggle__icon" aria-hidden="true">
                <span className="menu-toggle__line" />
                <span className="menu-toggle__line" />
                <span className="menu-toggle__line" />
              </span>
              <span className="visually-hidden">
                {isMenuOpen ? "Close menu" : "Open menu"}
              </span>
            </button>
          </div>

          {isMenuOpen ? (
            <button
              type="button"
              className="site-nav-backdrop site-nav-backdrop--institutional"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
            />
          ) : null}
        </div>
      </div>
    </header>
  );
}
