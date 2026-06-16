"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { scrollToHashWithRetry, scrollToNavTargetWithRetry } from "@/lib/scroll-navigation";

export default function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      scrollToHashWithRetry(hash, "instant");
    } else {
      scrollToNavTargetWithRetry(pathname, "instant");
    }

    const handleHashChange = () => {
      scrollToHashWithRetry(window.location.hash || undefined);
    };

    const handleClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest("a[href]");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      const url = new URL(href, window.location.href);
      if (
        url.origin === window.location.origin &&
        url.pathname === window.location.pathname &&
        url.hash
      ) {
        window.setTimeout(() => scrollToHashWithRetry(url.hash), 0);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    document.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      document.removeEventListener("click", handleClick);
    };
  }, [pathname]);

  return null;
}
