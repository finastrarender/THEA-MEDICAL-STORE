"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function scrollToCurrentHash() {
  const hash = window.location.hash;
  if (!hash) return;

  const id = decodeURIComponent(hash.slice(1));
  if (!id) return;

  const target = document.getElementById(id);
  if (!target) return;

  target.scrollIntoView({ block: "start" });
}

export default function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    const scrollSoon = () => {
      window.requestAnimationFrame(() => {
        scrollToCurrentHash();
        window.setTimeout(scrollToCurrentHash, 80);
      });
    };

    scrollSoon();

    const handleHashChange = () => scrollSoon();
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
        window.setTimeout(scrollToCurrentHash, 0);
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
