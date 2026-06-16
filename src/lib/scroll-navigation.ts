/** Offset for fixed/sticky site header when scrolling to in-page targets. */
export function getSiteHeaderOffset(): number {
  const header = document.querySelector(".site-header--thea, .site-header--institutional");
  if (header instanceof HTMLElement) {
    return Math.ceil(header.getBoundingClientRect().height);
  }
  return 80;
}

export function scrollToPageTop(behavior: ScrollBehavior = "smooth") {
  window.scrollTo({ top: 0, left: 0, behavior });
}

export function scrollToElementId(id: string, behavior: ScrollBehavior = "smooth"): boolean {
  const target = document.getElementById(id);
  if (!target) return false;

  const top =
    target.getBoundingClientRect().top + window.scrollY - getSiteHeaderOffset();
  window.scrollTo({ top: Math.max(0, top), left: 0, behavior });
  return true;
}

export function scrollToHash(hash: string, behavior: ScrollBehavior = "smooth"): boolean {
  if (!hash || hash === "#") {
    scrollToPageTop(behavior);
    return true;
  }

  const id = decodeURIComponent(hash.slice(1));
  if (!id) {
    scrollToPageTop(behavior);
    return true;
  }

  return scrollToElementId(id, behavior);
}

/** Default section ids for primary nav routes (home page sections + page heroes). */
export const NAV_PAGE_SCROLL_TARGETS: Record<string, string> = {
  "/": "home",
  "/services": "services",
  "/about": "about",
  "/products": "products",
  "/clients": "clients",
  "/contact": "contact",
};

export function scrollToNavTarget(pathname: string, behavior: ScrollBehavior = "smooth") {
  const normalized = pathname === "" ? "/" : pathname;
  const targetId = NAV_PAGE_SCROLL_TARGETS[normalized];
  if (targetId && scrollToElementId(targetId, behavior)) {
    return;
  }
  scrollToPageTop(behavior);
}

export function scrollToNavTargetWithRetry(
  pathname: string,
  behavior: ScrollBehavior = "smooth",
) {
  const delays = [0, 50, 120, 250, 400, 600];
  for (const delay of delays) {
    window.setTimeout(() => scrollToNavTarget(pathname, behavior), delay);
  }
}

export function scrollToHashWithRetry(hash?: string, behavior: ScrollBehavior = "smooth") {
  const delays = [0, 50, 120, 250, 400, 600];
  for (const delay of delays) {
    window.setTimeout(() => {
      if (hash) {
        scrollToHash(hash, behavior);
      } else {
        scrollToPageTop(behavior);
      }
    }, delay);
  }
}
