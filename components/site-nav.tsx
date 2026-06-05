"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#watch", label: "Talks" },
  { href: "/media", label: "Media" },
  { href: "/writing", label: "Writing" },
  { href: "/#contact", label: "Contact" },
];

/**
 * Themed navigation reused across the inner pages (blog index + posts).
 * Mirrors the homepage nav styling and carries the same dark/light toggle.
 */
export default function SiteNav() {
  const navRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem("chet-theme") === "light") {
        document.documentElement.setAttribute("data-theme", "light");
      }
    } catch {}

    const toggle = toggleRef.current;
    const onToggle = () => {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      if (isLight) {
        document.documentElement.removeAttribute("data-theme");
        try {
          localStorage.setItem("chet-theme", "dark");
        } catch {}
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        try {
          localStorage.setItem("chet-theme", "light");
        } catch {}
      }
    };
    toggle?.addEventListener("click", onToggle);

    const nav = navRef.current;
    const onScroll = () => {
      if (!nav) return;
      if (window.scrollY > 24) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      toggle?.removeEventListener("click", onToggle);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav className="nav" id="nav" ref={navRef}>
      <div className="nav__inner container">
        <Link href="/" className="logo">
          <span className="logo__mark"></span>
          <span className="logo__name">
            Chetan <em>Mangalwedhe</em>
          </span>
        </Link>
        <div className="nav__links">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="nav__right">
          <Link href="/#newsletter" className="nav__cta">
            Subscribe
            <svg viewBox="0 0 12 12" fill="none">
              <path
                d="M1 6h10m0 0L7 2m4 4l-4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <button
            className="theme-toggle"
            aria-label="Toggle theme"
            title="Toggle light/dark theme"
            ref={toggleRef}
          >
            <svg className="moon" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg className="sun" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
