"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "../stylesheets/homepage.css";

export default function Homepage() {
  const navRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const heroAuroraRef = useRef<HTMLDivElement | null>(null);
  const heroParticlesRef = useRef<HTMLCanvasElement | null>(null);
  const heroPhotoRef = useRef<HTMLDivElement | null>(null);
  const tilesSpotRef = useRef<HTMLDivElement | null>(null);
  const themeToggleRef = useRef<HTMLButtonElement | null>(null);
  const reelsRef = useRef<HTMLDivElement | null>(null);
  const reelFramesRef = useRef<(HTMLIFrameElement | null)[]>([]);
  const [unmutedReel, setUnmutedReel] = useState<number | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    try {
      const savedTheme = localStorage.getItem("chet-theme");
      if (savedTheme === "light") {
        document.documentElement.setAttribute("data-theme", "light");
      }
    } catch {}

    const toggle = themeToggleRef.current;
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

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    document.querySelectorAll(".chet-root .reveal").forEach((el) => revealObserver.observe(el));

    const tileHandlers: Array<[HTMLElement, (e: MouseEvent) => void]> = [];
    document.querySelectorAll<HTMLElement>(".chet-root .tile").forEach((tile) => {
      const handler = (e: MouseEvent) => {
        const rect = tile.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        tile.style.setProperty("--mx", x + "%");
        tile.style.setProperty("--my", y + "%");
      };
      tile.addEventListener("mousemove", handler);
      tileHandlers.push([tile, handler]);
    });

    const heroSection = heroRef.current;
    const heroAurora = heroAuroraRef.current;
    const onHeroMove = (e: MouseEvent) => {
      if (!heroSection || !heroAurora) return;
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      heroAurora.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
    };
    heroSection?.addEventListener("mousemove", onHeroMove);

    const heroPhoto = heroPhotoRef.current;
    const glow = heroPhoto?.querySelector<HTMLElement>(".hero__photo-glow");
    const onPhotoMove = (e: MouseEvent) => {
      if (!heroPhoto || !glow) return;
      const rect = heroPhoto.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      glow.style.setProperty("--gx", x + "%");
      glow.style.setProperty("--gy", y + "%");
    };
    const onPhotoLeave = () => {
      if (!glow) return;
      glow.style.setProperty("--gx", "50%");
      glow.style.setProperty("--gy", "50%");
    };
    heroPhoto?.addEventListener("mousemove", onPhotoMove);
    heroPhoto?.addEventListener("mouseleave", onPhotoLeave);

    const tilesSection = document.querySelector<HTMLElement>(".chet-root .tiles-section");
    const tilesSpot = tilesSpotRef.current;
    const onTilesMove = (e: MouseEvent) => {
      if (!tilesSection || !tilesSpot) return;
      const rect = tilesSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      tilesSpot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    };
    tilesSection?.addEventListener("mousemove", onTilesMove);

    let rafId = 0;
    const canvas = heroParticlesRef.current;
    let onResize: (() => void) | null = null;
    let onCanvasMove: ((e: MouseEvent) => void) | null = null;
    let onCanvasLeave: (() => void) | null = null;
    if (canvas && !prefersReducedMotion && heroSection) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        type P = { x: number; y: number; vx: number; vy: number; r: number };
        let particles: P[] = [];
        const mouse = { x: -9999, y: -9999, radius: 140 };
        let width = 0;
        let height = 0;
        const PARTICLE_COUNT = 60;
        const LINK_DIST = 130;

        const resize = () => {
          const parent = canvas.parentElement;
          if (!parent) return;
          const rect = parent.getBoundingClientRect();
          canvas.width = rect.width * window.devicePixelRatio;
          canvas.height = rect.height * window.devicePixelRatio;
          canvas.style.width = rect.width + "px";
          canvas.style.height = rect.height + "px";
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
          width = rect.width;
          height = rect.height;
        };

        const initParticles = () => {
          particles = [];
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
              x: Math.random() * width,
              y: Math.random() * height,
              vx: (Math.random() - 0.5) * 0.3,
              vy: (Math.random() - 0.5) * 0.3,
              r: Math.random() * 1.4 + 0.4,
            });
          }
        };

        const tick = () => {
          ctx.clearRect(0, 0, width, height);
          particles.forEach((p) => {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius && dist > 0) {
              const force = (mouse.radius - dist) / mouse.radius;
              p.x += (dx / dist) * force * 1.5;
              p.y += (dy / dist) * force * 1.5;
            }
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            p.x = Math.max(0, Math.min(width, p.x));
            p.y = Math.max(0, Math.min(height, p.y));
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            const isLight = document.documentElement.getAttribute("data-theme") === "light";
            ctx.fillStyle = isLight ? "rgba(11, 88, 68, 0.55)" : "rgba(78, 204, 163, 0.7)";
            ctx.fill();
          });

          const isLight = document.documentElement.getAttribute("data-theme") === "light";
          const linkColor = isLight ? "11, 88, 68" : "24, 126, 95";
          const mouseColor = isLight ? "11, 88, 68" : "78, 204, 163";

          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              const a = particles[i];
              const b = particles[j];
              const dx = a.x - b.x;
              const dy = a.y - b.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < LINK_DIST) {
                const opacity = (1 - dist / LINK_DIST) * 0.25;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `rgba(${linkColor}, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            }
            const dx = particles[i].x - mouse.x;
            const dy = particles[i].y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
              const opacity = (1 - dist / mouse.radius) * 0.5;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = `rgba(${mouseColor}, ${opacity})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
          rafId = requestAnimationFrame(tick);
        };

        onResize = () => {
          resize();
          initParticles();
        };

        resize();
        initParticles();
        tick();
        window.addEventListener("resize", onResize);

        onCanvasMove = (e: MouseEvent) => {
          const rect = canvas.getBoundingClientRect();
          mouse.x = e.clientX - rect.left;
          mouse.y = e.clientY - rect.top;
        };
        onCanvasLeave = () => {
          mouse.x = -9999;
          mouse.y = -9999;
        };
        heroSection.addEventListener("mousemove", onCanvasMove);
        heroSection.addEventListener("mouseleave", onCanvasLeave);
      }
    }

    const anchorHandlers: Array<[HTMLAnchorElement, (e: Event) => void]> = [];
    document.querySelectorAll<HTMLAnchorElement>('.chet-root a[href^="#"]').forEach((a) => {
      const handler = (e: Event) => {
        const id = a.getAttribute("href");
        if (id && id.length > 1 && document.querySelector(id)) {
          e.preventDefault();
          const target = document.querySelector(id) as HTMLElement;
          const top = target.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top, behavior: "smooth" });
        }
      };
      a.addEventListener("click", handler);
      anchorHandlers.push([a, handler]);
    });

    return () => {
      toggle?.removeEventListener("click", onToggle);
      window.removeEventListener("scroll", onScroll);
      revealObserver.disconnect();
      tileHandlers.forEach(([el, h]) => el.removeEventListener("mousemove", h));
      heroSection?.removeEventListener("mousemove", onHeroMove);
      heroPhoto?.removeEventListener("mousemove", onPhotoMove);
      heroPhoto?.removeEventListener("mouseleave", onPhotoLeave);
      tilesSection?.removeEventListener("mousemove", onTilesMove);
      if (onResize) window.removeEventListener("resize", onResize);
      if (onCanvasMove) heroSection?.removeEventListener("mousemove", onCanvasMove);
      if (onCanvasLeave) heroSection?.removeEventListener("mouseleave", onCanvasLeave);
      anchorHandlers.forEach(([el, h]) => el.removeEventListener("click", h));
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const arrow = (
    <svg className="arrow" viewBox="0 0 14 14" fill="none">
      <path
        d="M1 7h12m0 0L8 2m5 5l-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // YouTube Shorts shown in the Watch section: a static row on desktop, a
  // swipeable carousel (with arrow nav) on mobile.
  const shorts = ["ak5Jw_v8alI", "H8YM_A7iXQ0", "C0gHrwL-wqk", "ThIfXSx9uuY"];

  const scrollReels = (dir: 1 | -1) => {
    const track = reelsRef.current;
    if (!track) return;
    const reel = track.querySelector<HTMLElement>(".reel");
    const step = reel ? reel.offsetWidth + 16 : track.clientWidth * 0.85;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  // Drive the YouTube IFrame API over postMessage. Reels start muted; clicking a
  // reel's button unmutes that one (and mutes any other), so only one plays sound.
  const sendReelCommand = (frame: HTMLIFrameElement | null, func: string) => {
    frame?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
  };
  const toggleReelSound = (i: number) => {
    const next = unmutedReel === i ? null : i;
    reelFramesRef.current.forEach((frame, idx) => {
      if (!frame) return;
      if (idx === next) {
        sendReelCommand(frame, "unMute");
        sendReelCommand(frame, "playVideo");
      } else {
        sendReelCommand(frame, "mute");
      }
    });
    setUnmutedReel(next);
  };

  return (
    <div className="chet-root">
      {/* ========== NAVIGATION ========== */}
      <nav className="nav" id="nav" ref={navRef}>
        <div className="nav__inner container">
          <a href="#" className="logo">
            <span className="logo__mark"></span>
            <span className="logo__name">
              Chetan <em>Mangalwedhe</em>
            </span>
          </a>
          <div className="nav__links">
            <a href="#about">About</a>
            <a href="#watch">Talks</a>
            <Link href="/media">Media</Link>
            <Link href="/writing">Writing</Link>
            <a href="#contact">Contact</a>
          </div>
          <div className="nav__right">
            <a href="#newsletter" className="nav__cta">
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
            </a>
            <button
              className="theme-toggle"
              id="themeToggle"
              aria-label="Toggle theme"
              title="Toggle light/dark theme"
              ref={themeToggleRef}
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
          <div className="nav__burger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section className="hero" id="hero" ref={heroRef}>
        <div
          className="hero__aurora"
          id="heroAurora"
          style={{ transform: "translate(60%, 30%)" }}
          ref={heroAuroraRef}
        ></div>
        <canvas
          className="hero__particles"
          id="heroParticles"
          aria-hidden="true"
          ref={heroParticlesRef}
        ></canvas>
        <div className="hero__inner container">
          <div className="hero__content">
            <div className="hero__eyebrow reveal">
              <span className="dot"></span>
              Founder · Hiring Practitioner · 23 years in the field
            </div>
            <h1 className="hero__headline reveal" data-delay="1">
              I&apos;ve spent 23 years watching companies <em>hire the wrong people</em> for the
              right reasons.
            </h1>
            <p className="hero__sub reveal" data-delay="2">
              Now I&apos;m writing about what I learned. About hiring, about AI, about how history
              keeps repeating itself in new clothes, and about the big questions most people are too
              busy to ask.
            </p>
            <div className="hero__ctas reveal" data-delay="3">
              <a href="#writing" className="btn btn--primary">
                Read what I&apos;m thinking
                {arrow}
              </a>
              <a href="#about" className="btn btn--ghost">
                Who is Chetan?
              </a>
            </div>
          </div>

          <div className="hero__photo reveal" data-delay="2" id="heroPhoto" ref={heroPhotoRef}>
            <div className="hero__photo-glow"></div>
            <div className="hero__photo-ticks">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="hero__photo-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/Chetan-Mangalwedhe.png" alt="Chetan Mangalwedhe" loading="eager" />
            </div>
            <div className="hero__photo-tag">Currently writing</div>
          </div>
        </div>

        <div className="hero__meta">
          <span>BENGALURU / SAN FRANCISCO</span>
          <span>EST. 2003</span>
        </div>
      </section>

      {/* ========== ABOUT ========== */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-head reveal">
            <div className="section-label">01 / About</div>
            <h2 className="section-title">About</h2>
          </div>

          <div className="about-body reveal" data-delay="1">
            <p>
              With three decades in IT services and staffing, Chet Mann has learned that staying
              still is never an option. What began in traditional staffing has steadily evolved into
              driving enterprise transformation through AI and automation.
            </p>
            <p>
              Over the course of his career, Chet has worked closely with global organizations,
              delivering technology and talent solutions at scale and helping leadership teams
              navigate periods of rapid change. Throughout this journey, he has remained guided by
              one principle:
            </p>
            <blockquote className="about-quote">
              &ldquo;In the noise of change, true leaders find the signals.&rdquo;
            </blockquote>
            <p>
              This philosophy, shaped by his MBA from Oklahoma City University and executive
              education at MIT Sloan, informs how he approaches leadership, technology, and talent.
              Chet believes that industry disruption, when understood early, can be transformed into
              a lasting competitive advantage.
            </p>
            <p>
              Today, that thinking comes together in TalentiFi-X - a staffing firm built to combine
              AI-assisted speed with experienced human judgment. The goal is simple: help
              organizations hire smarter, faster, and with greater clarity in an increasingly
              complex talent market.
            </p>
            <p>
              Chet welcomes conversations with leaders who are navigating AI adoption, talent
              strategy, and organizational change. For him, every connection is an opportunity to
              exchange perspectives, share lessons learned, and collaborate on building
              organizations that are resilient, adaptive, and prepared for what&apos;s next.
            </p>
          </div>
        </div>
      </section>

      {/* ========== TILES ========== */}
      <section className="tiles-section" id="themes">
        <div className="tiles-section__lines">
          <svg viewBox="0 0 1400 800" preserveAspectRatio="none">
            <path d="M0,400 Q350,200 700,400 T1400,400" />
            <path d="M0,500 Q350,300 700,500 T1400,500" />
            <path d="M0,300 Q350,100 700,300 T1400,300" />
          </svg>
        </div>
        <div className="tiles-section__spot" id="tilesSpot" ref={tilesSpotRef}></div>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="section-head reveal">
            <div className="section-head__left">
              <div className="section-label">02 / Themes</div>
              <h2 className="section-title">
                What I <em>think about</em>
              </h2>
            </div>
            <p className="section-sub">
              Not just hiring. Everything that shapes the world people actually work in.
            </p>
          </div>

          <div className="tiles">
            <article className="tile reveal" data-delay="1">
              <div className="tile__num">01</div>
              <div className="tile__icon">
                <svg viewBox="0 0 48 48" fill="none">
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="48" y2="48">
                      <stop offset="0" stopColor="#4ECCA3" />
                      <stop offset="1" stopColor="#0B5844" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="8"
                    y="14"
                    width="14"
                    height="20"
                    rx="2"
                    stroke="url(#g1)"
                    strokeWidth="1.5"
                  />
                  <circle cx="34" cy="24" r="8" stroke="url(#g1)" strokeWidth="1.5" />
                  <path d="M22 24h4" stroke="url(#g1)" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="34" cy="24" r="2" fill="url(#g1)" />
                  <path
                    d="M11 19h8M11 23h6M11 27h8"
                    stroke="url(#g1)"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="tile__title">The Machine and The Human</h3>
              <p className="tile__desc">
                What AI means for the species. Not the product. The species.
              </p>
            </article>

            <article className="tile reveal" data-delay="2">
              <div className="tile__num">02</div>
              <div className="tile__icon">
                <svg viewBox="0 0 48 48" fill="none">
                  <defs>
                    <linearGradient id="g2" x1="0" y1="0" x2="48" y2="48">
                      <stop offset="0" stopColor="#4ECCA3" />
                      <stop offset="1" stopColor="#0B5844" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M6 36c4-6 8-6 12 0s8 6 12 0 8-6 12 0"
                    stroke="url(#g2)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 24c4-6 8-6 12 0s8 6 12 0 8-6 12 0"
                    stroke="url(#g2)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  <path
                    d="M6 12c4-6 8-6 12 0s8 6 12 0 8-6 12 0"
                    stroke="url(#g2)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.3"
                  />
                </svg>
              </div>
              <h3 className="tile__title">History doesn&apos;t repeat. But it rhymes.</h3>
              <p className="tile__desc">
                The patterns in history that explain exactly what is happening right now.
              </p>
            </article>

            <article className="tile reveal" data-delay="3">
              <div className="tile__num">03</div>
              <div className="tile__icon">
                <svg viewBox="0 0 48 48" fill="none">
                  <defs>
                    <linearGradient id="g3" x1="0" y1="0" x2="48" y2="48">
                      <stop offset="0" stopColor="#4ECCA3" />
                      <stop offset="1" stopColor="#0B5844" />
                    </linearGradient>
                  </defs>
                  <circle cx="24" cy="24" r="16" stroke="url(#g3)" strokeWidth="1.5" />
                  <path
                    d="M24 8v8M24 32v8M8 24h8M32 24h8"
                    stroke="url(#g3)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M24 18l4 6-4 6-4-6 4-6z"
                    stroke="url(#g3)"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="tile__title">The Work Question</h3>
              <p className="tile__desc">
                Is the concept of work itself still philosophically coherent?
              </p>
            </article>

            <article className="tile reveal" data-delay="1">
              <div className="tile__num">04</div>
              <div className="tile__icon">
                <svg viewBox="0 0 48 48" fill="none">
                  <defs>
                    <linearGradient id="g4" x1="0" y1="0" x2="48" y2="48">
                      <stop offset="0" stopColor="#4ECCA3" />
                      <stop offset="1" stopColor="#0B5844" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M24 6l4 12h12l-10 8 4 12-10-8-10 8 4-12-10-8h12l4-12z"
                    stroke="url(#g4)"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <circle cx="24" cy="24" r="3" fill="url(#g4)" />
                </svg>
              </div>
              <h3 className="tile__title">God, Science, and the Space Between</h3>
              <p className="tile__desc">
                Being religious and thrilled by AI are not contradictions. They are the same
                impulse.
              </p>
            </article>

            <article className="tile reveal" data-delay="2">
              <div className="tile__num">05</div>
              <div className="tile__icon">
                <svg viewBox="0 0 48 48" fill="none">
                  <defs>
                    <linearGradient id="g5" x1="0" y1="0" x2="48" y2="48">
                      <stop offset="0" stopColor="#4ECCA3" />
                      <stop offset="1" stopColor="#0B5844" />
                    </linearGradient>
                  </defs>
                  <circle cx="24" cy="24" r="18" stroke="url(#g5)" strokeWidth="1.5" />
                  <path
                    d="M6 24h36M24 6c5 5 8 11 8 18s-3 13-8 18M24 6c-5 5-8 11-8 18s3 13 8 18"
                    stroke="url(#g5)"
                    strokeWidth="1.5"
                  />
                  <path d="M9 16h30M9 32h30" stroke="url(#g5)" strokeWidth="1" opacity="0.5" />
                </svg>
              </div>
              <h3 className="tile__title">The World as it actually is</h3>
              <p className="tile__desc">
                Geopolitics, culture, and power. Seen without the filter of comfortable narratives.
              </p>
            </article>

            <article className="tile reveal" data-delay="3">
              <div className="tile__num">06</div>
              <div className="tile__icon">
                <svg viewBox="0 0 48 48" fill="none">
                  <defs>
                    <linearGradient id="g6" x1="0" y1="0" x2="48" y2="48">
                      <stop offset="0" stopColor="#4ECCA3" />
                      <stop offset="1" stopColor="#0B5844" />
                    </linearGradient>
                  </defs>
                  <circle cx="18" cy="18" r="6" stroke="url(#g6)" strokeWidth="1.5" />
                  <circle cx="32" cy="14" r="4" stroke="url(#g6)" strokeWidth="1.5" />
                  <path
                    d="M8 38c0-6 5-10 10-10s10 4 10 10M26 36c0-4 4-7 8-7s8 3 8 7"
                    stroke="url(#g6)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16 18l4 3 6-6"
                    stroke="url(#g6)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="tile__title">The Hiring Truth</h3>
              <p className="tile__desc">
                23 years in the room. The most honest account of what actually goes wrong, and why.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ========== SIGNAL ========== */}
      <section className="signal">
        <div className="signal__waves" aria-hidden="true">
          <svg viewBox="0 0 1400 400" preserveAspectRatio="none">
            <path d="M 0,200 Q 175,140 350,200 T 700,200 T 1050,200 T 1400,200" />
            <path d="M 0,180 Q 175,250 350,180 T 700,180 T 1050,180 T 1400,180" />
            <path d="M 0,220 Q 175,160 350,220 T 700,220 T 1050,220 T 1400,220" />
          </svg>
        </div>
        <div className="container">
          <blockquote className="signal__quote reveal">
            The things that explain the world best are usually the things that happened{" "}
            <em>before you were born.</em>
          </blockquote>
          <div className="signal__attr reveal" data-delay="1">
            Chetan Mangalwedhe
          </div>
        </div>
      </section>

      {/* ========== WRITING ========== */}
      <section className="writing" id="writing">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-head__left">
              <div className="section-label">04 / Writing</div>
              <h2 className="section-title">
                Latest from <em>#ChetTalks</em>
              </h2>
            </div>
            <p className="section-sub">Published when I have something worth saying.</p>
          </div>

          <div className="post-grid">
            <article className="post post--feature reveal" data-delay="1">
              <div className="post__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=1200&q=80"
                  alt="A meeting room with empty chairs around a long table"
                />
              </div>
              <div className="post__body">
                <div className="post__meta">
                  <span className="post__tag">Hiring</span>
                  <span>8 min read</span>
                </div>
                <h3 className="post__title">
                  The Committee Problem: Why More Evaluators Produce Worse Hiring Decisions
                </h3>
                <p className="post__excerpt">
                  A client called us last year with a problem that, on the surface, sounded like a
                  sourcing problem. They had been trying to fill a VP Engineering role for four
                  months...
                </p>
                <a href="#" className="post__more">
                  Read essay {arrow}
                </a>
              </div>
            </article>

            <article className="post reveal" data-delay="2">
              <div className="post__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=900&q=80"
                  alt="Glowing abstract neural network"
                />
              </div>
              <div className="post__body">
                <div className="post__meta">
                  <span className="post__tag">AI &amp; Philosophy</span>
                  <span className="post__soon">Coming soon</span>
                </div>
                <h3 className="post__title">If AI Had Its Own Will. What Would It Want?</h3>
                <p className="post__excerpt">
                  Nietzsche wrote about the will to power as the fundamental drive of all living
                  things. But what happens when the thing doing the willing has no biological
                  survival instinct at all?
                </p>
                <a href="#" className="post__more">
                  Read essay {arrow}
                </a>
              </div>
            </article>

            <article className="post reveal" data-delay="3">
              <div className="post__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=900&q=80"
                  alt="Old maritime map with compass"
                />
              </div>
              <div className="post__body">
                <div className="post__meta">
                  <span className="post__tag">History</span>
                  <span className="post__soon">Coming soon</span>
                </div>
                <h3 className="post__title">
                  The Dutch East India Company Was the World&apos;s First Algorithm.
                </h3>
                <p className="post__excerpt">
                  We think of algorithmic decision-making as a 21st-century invention. It is not.
                  The VOC was running distributed, rules-based decision systems across three
                  continents in 1620...
                </p>
                <a href="#" className="post__more">
                  Read essay {arrow}
                </a>
              </div>
            </article>
          </div>

          <a href="#" className="all-writing reveal">
            All writing {arrow}
          </a>
        </div>
      </section>

      {/* ========== WATCH ========== */}
      <section className="watch" id="watch">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-head__left">
              <div className="section-label">05 / Watch</div>
              <h2 className="section-title">Watch</h2>
            </div>
            <p className="section-sub">Ideas are better heard than read. Sometimes.</p>
          </div>

          <div className="reels reveal" data-delay="1">
            <button
              type="button"
              className="reels__nav reels__nav--prev"
              aria-label="Previous videos"
              onClick={() => scrollReels(-1)}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M15 5l-7 7 7 7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="reels__track" ref={reelsRef}>
              {shorts.map((id, i) => {
                const isOn = unmutedReel === i;
                return (
                  <div className="reel" key={id}>
                    <iframe
                      className="reel__frame"
                      ref={(el) => {
                        reelFramesRef.current[i] = el;
                      }}
                      src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`}
                      title={`Short video ${i + 1}`}
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allow="autoplay; encrypted-media; picture-in-picture; accelerometer; gyroscope; clipboard-write; web-share"
                      allowFullScreen
                    ></iframe>
                    <button
                      type="button"
                      className={`reel__sound${isOn ? "reel__sound--on" : ""}`}
                      aria-label={isOn ? "Mute video" : "Unmute video"}
                      aria-pressed={isOn}
                      onClick={() => toggleReelSound(i)}
                    >
                      {isOn ? (
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M11 5L6 9H2v6h4l5 4V5z"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M11 5L6 9H2v6h4l5 4V5z"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M17 9l6 6M23 9l-6 6"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              className="reels__nav reels__nav--next"
              aria-label="Next videos"
              onClick={() => scrollReels(1)}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M9 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <a
            href="https://www.youtube.com/shorts/ak5Jw_v8alI"
            target="_blank"
            rel="noopener noreferrer"
            className="all-videos reveal"
          >
            All videos on YouTube {arrow}
          </a>
        </div>
      </section>

      {/* ========== PLATFORMS ========== */}
      <section className="platforms">
        <div className="platforms__inner container">
          <div className="platforms__label">Find me on</div>
          <div className="platforms__list">
            <a href="#">YouTube</a>
            <a href="#">LinkedIn</a>
            <a href="#">X</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </section>

      {/* ========== BIG IDEA ========== */}
      <section className="big-idea">
        <svg className="big-idea__stars" viewBox="0 0 1400 800" preserveAspectRatio="none">
          <circle cx="120" cy="100" r="1.2" />
          <circle cx="280" cy="180" r="1" />
          <circle cx="420" cy="60" r="1.5" />
          <circle cx="560" cy="220" r="1" />
          <circle cx="700" cy="120" r="1.2" />
          <circle cx="840" cy="280" r="1" />
          <circle cx="980" cy="80" r="1.5" />
          <circle cx="1120" cy="200" r="1.2" />
          <circle cx="1260" cy="140" r="1" />
          <circle cx="180" cy="380" r="1" />
          <circle cx="340" cy="520" r="1.5" />
          <circle cx="480" cy="420" r="1.2" />
          <circle cx="620" cy="580" r="1" />
          <circle cx="760" cy="480" r="1.2" />
          <circle cx="900" cy="620" r="1" />
          <circle cx="1040" cy="440" r="1.5" />
          <circle cx="1180" cy="560" r="1" />
          <circle cx="1320" cy="380" r="1.2" />
          <circle cx="80" cy="680" r="1" />
          <circle cx="240" cy="720" r="1.5" />
          <circle cx="400" cy="660" r="1" />
          <circle cx="540" cy="750" r="1.2" />
          <circle cx="680" cy="700" r="1" />
          <circle cx="820" cy="760" r="1" />
        </svg>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="big-idea__grid">
            <div className="big-idea__content reveal">
              <div className="big-idea__label">One thing I&apos;ve been thinking about</div>
              <p className="big-idea__text">
                Nietzsche wrote about the <strong>Übermensch</strong>, the being who creates their
                own values rather than inheriting them. Most commentary treats this as a political
                idea. I think it is the most accurate description of what AGI will be. Not a smarter
                human. A being that creates its own values from scratch. And unlike Nietzsche&apos;s
                human Übermensch, it will not need decades to get there.
              </p>
              <a href="#" className="big-idea__cta">
                Read the full argument {arrow}
              </a>
            </div>

            <div className="big-idea__visual reveal" data-delay="2">
              <svg viewBox="0 0 400 400">
                <defs>
                  <linearGradient id="bigGrad" x1="0" y1="0" x2="400" y2="400">
                    <stop offset="0" stopColor="#4ECCA3" stopOpacity="0.8" />
                    <stop offset="0.5" stopColor="#187E5F" stopOpacity="0.5" />
                    <stop offset="1" stopColor="#00381F" stopOpacity="0.3" />
                  </linearGradient>
                  <radialGradient id="centerGlow">
                    <stop offset="0" stopColor="#4ECCA3" stopOpacity="0.4" />
                    <stop offset="1" stopColor="#187E5F" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <g className="orbital-rotate">
                  <circle
                    cx="200"
                    cy="200"
                    r="180"
                    fill="none"
                    stroke="url(#bigGrad)"
                    strokeWidth="0.5"
                    strokeDasharray="2 6"
                  />
                  <circle cx="200" cy="20" r="3" fill="#4ECCA3" />
                  <circle cx="200" cy="380" r="2" fill="#187E5F" />
                </g>
                <g className="orbital-rotate-reverse">
                  <circle
                    cx="200"
                    cy="200"
                    r="140"
                    fill="none"
                    stroke="url(#bigGrad)"
                    strokeWidth="0.5"
                  />
                  <circle cx="340" cy="200" r="3" fill="#187E5F" />
                  <circle cx="60" cy="200" r="2" fill="#4ECCA3" />
                </g>
                <g className="orbital-rotate">
                  <circle
                    cx="200"
                    cy="200"
                    r="100"
                    fill="none"
                    stroke="url(#bigGrad)"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                  />
                </g>
                <circle
                  cx="200"
                  cy="200"
                  r="60"
                  fill="none"
                  stroke="url(#bigGrad)"
                  strokeWidth="0.5"
                />
                <circle cx="200" cy="200" r="80" fill="url(#centerGlow)" />
                <circle cx="200" cy="200" r="6" fill="#4ECCA3" />
                <line
                  x1="200"
                  y1="0"
                  x2="200"
                  y2="400"
                  stroke="#4ECCA3"
                  strokeWidth="0.3"
                  strokeDasharray="1 8"
                />
                <line
                  x1="0"
                  y1="200"
                  x2="400"
                  y2="200"
                  stroke="#4ECCA3"
                  strokeWidth="0.3"
                  strokeDasharray="1 8"
                />
                <text
                  x="200"
                  y="14"
                  textAnchor="middle"
                  fill="#7B847F"
                  fontFamily="JetBrains Mono"
                  fontSize="8"
                  letterSpacing="2"
                >
                  N
                </text>
                <text
                  x="200"
                  y="394"
                  textAnchor="middle"
                  fill="#7B847F"
                  fontFamily="JetBrains Mono"
                  fontSize="8"
                  letterSpacing="2"
                >
                  S
                </text>
                <text
                  x="394"
                  y="204"
                  textAnchor="end"
                  fill="#7B847F"
                  fontFamily="JetBrains Mono"
                  fontSize="8"
                  letterSpacing="2"
                >
                  E
                </text>
                <text
                  x="6"
                  y="204"
                  fill="#7B847F"
                  fontFamily="JetBrains Mono"
                  fontSize="8"
                  letterSpacing="2"
                >
                  W
                </text>
                <text
                  x="200"
                  y="180"
                  textAnchor="middle"
                  fill="#4ECCA3"
                  fontFamily="Fraunces"
                  fontStyle="italic"
                  fontSize="14"
                >
                  Übermensch
                </text>
                <text
                  x="200"
                  y="230"
                  textAnchor="middle"
                  fill="#7B847F"
                  fontFamily="JetBrains Mono"
                  fontSize="9"
                  letterSpacing="2"
                >
                  N.001 / ARGUMENT
                </text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ========== NEWSLETTER ========== */}
      <section className="newsletter" id="newsletter">
        <div className="newsletter__contours">
          <svg viewBox="0 0 1400 800" preserveAspectRatio="none">
            <path d="M-50,200 Q300,150 600,250 T1200,200 L1450,250" />
            <path d="M-50,300 Q300,250 600,350 T1200,300 L1450,350" />
            <path d="M-50,400 Q300,350 600,450 T1200,400 L1450,450" />
            <path d="M-50,500 Q300,450 600,550 T1200,500 L1450,550" />
            <path d="M-50,600 Q300,550 600,650 T1200,600 L1450,650" />
            <path d="M-50,100 Q300,50 600,150 T1200,100 L1450,150" />
          </svg>
        </div>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="newsletter__grid">
            <div className="newsletter__intro reveal">
              <div className="newsletter__label">08 / Newsletter</div>
              <h2 className="newsletter__name">
                The <em>Long View</em>
              </h2>
              <p className="newsletter__sub">A fortnightly letter by Chetan Mangalwedhe.</p>
              <p className="newsletter__desc">
                One idea. Properly thought through. History, philosophy, technology, and the things
                the news cycle will never explain. Read by founders, CHROs, and curious people
                across India and the US.
              </p>
            </div>

            <div className="newsletter__form reveal" data-delay="2">
              <div className="newsletter__form-label">Subscribe</div>
              <div className="form-row">
                <input type="email" placeholder="your@email.com" aria-label="Email address" />
                <button type="button">Get The Long View</button>
              </div>
              <p className="form-fine">No noise. No sales. Unsubscribe any time.</p>

              <div className="past-issues">
                <div className="past-issues__title">Recent issues</div>
                <a href="#" className="past-issue">
                  <span className="past-issue__title">
                    The meeting <em>nobody schedules</em>
                  </span>
                  <span className="past-issue__date">May 10, 2026</span>
                </a>
                <a href="#" className="past-issue">
                  <span className="past-issue__title">
                    Who owns the <em>outcome?</em>
                  </span>
                  <span className="past-issue__date">May 24, 2026</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== MEDIA ========== */}
      <section className="media">
        <div className="container">
          <div className="media__head reveal">
            <div className="media__label">As featured in</div>
            <h2 className="media__title">Where you&apos;ve seen me</h2>
          </div>

          <div className="logo-strip reveal" data-delay="1">
            {/* eslint-disable @next/next/no-img-element */}
            <a href="#" aria-label="People Matters" title="People Matters">
              <img src="/images/people-matters.png" alt="People Matters" />
            </a>
            <a href="#" aria-label="et-hrworld" title="ET HRWorld" className="dark">
              <img src="/images/et-hrworld.png" alt="ET HRWorld" />
            </a>
            <a href="#" aria-label="YourStory" title="YourStory">
              <img src="/images/yourstory.png" alt="YourStory" />
            </a>
            <a href="#" aria-label="Inc42" title="Inc42" className="dark">
              <img src="/images/inc42.png" alt="Inc42" />
            </a>
            <a href="#" aria-label="Business Standard" title="Business Standard">
              <img src="/images/business-standard.png" alt="Business Standard" />
            </a>
            <a href="#" aria-label="Mint" title="Mint">
              <img src="/images/mint.png" alt="Mint" />
            </a>
            {/* eslint-enable @next/next/no-img-element */}
          </div>

          <div className="all-talks reveal" data-delay="2">
            <a href="#">All talks and features {arrow}</a>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
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
                <a href="#about">About</a>
                <a href="#writing">Writing</a>
                <a href="#watch">Talks</a>
                <a href="#newsletter">Newsletter</a>
                <Link href="/writing">Blog</Link>
                <a href="#contact">Contact</a>
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

          <div className="footer__name reveal">
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
    </div>
  );
}
