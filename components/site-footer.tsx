import Link from "next/link";

/** Themed footer reused on the inner pages, matching the homepage footer. */
export default function SiteFooter() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer__top">
          <div>
            <div className="logo" style={{ marginBottom: 24 }}>
              <span className="logo__mark"></span>
              <span className="logo__name">
                Chetan <em>Mangalwedhe</em>
              </span>
            </div>
            <p className="footer__tagline">
              Thinking out loud. <em>About the world we&apos;re actually building.</em>
            </p>
          </div>

          <div className="footer__links-wrap">
            <nav className="footer__nav">
              <Link href="/#about">About</Link>
              <Link href="/#writing">Writing</Link>
              <Link href="/#watch">Talks</Link>
              <Link href="/#newsletter">Newsletter</Link>
              <Link href="/writing">Blog</Link>
              <Link href="/#contact">Contact</Link>
            </nav>
            <div className="footer__social">
              <a href="#" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3v9zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                </svg>
              </a>
              <a href="#" aria-label="X">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
              <a href="#" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer__name">
          Chetan <em>Mangalwedhe</em>
        </div>

        <div className="footer__bottom">
          <div>© 2026 Chetan Mangalwedhe. All rights reserved.</div>
          <div>
            chetanmangalwedhe.com <span>·</span> Digitally Next <span>·</span> May 2026
          </div>
        </div>
      </div>
    </footer>
  );
}
