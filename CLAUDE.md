# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

DyroDigital — marketing website with two pages. Vanilla HTML, CSS, JavaScript. No frameworks, no build tools. Hosted on Vercel, domain via Vimexx, repo on GitHub (`dyrodigital/dyrodigital.com`).

Files:
- `index.html` — main single-page site
- `portfolio.html` — full portfolio overview
- `assets/css/style.css` — all styles
- `assets/js/main.js` — all JS (shared across pages)
- `assets/images/logo/` — logo-horizontal.png, logo-square.png, logo-square-orange.png (favicon)
- `assets/images/portfolio/` — project screenshots (.webp)
- `assets/images/testimonials/` — testimonial avatars (.webp)

## Design rules

- **Units**: `rem` everywhere. Never `px` for spacing, font sizes, or dimensions.
- **Border radius**: `1rem` on cards/containers. `999px` for pills (buttons, tags, badges). `50%` for circles (avatars).
- **Container padding**: `max(3rem, calc((100% - 1400px) / 2))` wide. `2rem` tablet (≤1024px). `1rem` mobile (≤768px).
- **Transitions**: `0.35s ease-out` default. Testimonial track: `0.45s cubic-bezier(.4,0,.2,1)`.
- **Colors**: `--accent:#ff6901`, `--bg:#0d1117`, `--surface:#161c26`, `--surface2:#1e2635`, `--text:#f0f2f5`, `--muted:#8892a4`, `--border:rgba(136,146,164,0.2)`.

## Typography (consistent, no per-context overrides)

- h1 — Inter Display, 4rem, weight 700, letter-spacing -2.5px
- h2 — Inter Display, 2.5rem, weight 700, letter-spacing -1px
- h3 — Inter Display, 1.75rem, weight 600, letter-spacing -0.5px (used in service cards)
- h4 — Inter Display, 1.125rem, weight 600, letter-spacing -0.3px, line-height 1.2 (used in portfolio/testimonial cards)
- p/li/a — Inter, 1rem
- `.text` class — 1rem, color var(--muted), margin 0, line-height 1.4 (used for all descriptive subtitles)

**No h3/h4 overrides per context** — h4 is used in portfolio cards and testimonial author names for consistency.

## CSS conventions

- Breakpoints: `1024px` (tablet/hamburger), `768px` (mobile), `600px` (stats single column).
- `.text` class handles all muted subtitle text (portfolio card types, testimonial company names).
- `.faq-a-inner` must stay as class — JS targets it. Add `text` class alongside for styling.
- `.testi-text` keeps `flex:1` and `line-height:1.8`, plus `color:var(--muted)` explicitly.
- Portfolio card overlay: `align-items:flex-start` — never stretch tags full width.
- Portfolio card gradient: `linear-gradient(to top right, rgba(13,17,23,0.85) 0%, rgba(13,17,23,0) 60%)` on `::after`, opacity 0.35 on hover.
- Service tag stagger: `nth-child` transition-delay 0/150/300/450ms on hover.
- Stats: 3 columns desktop, 1 column ≤600px.
- Footer: 3-column grid desktop, flex column centered ≤768px.
- Nav logo: `height:1.5rem`.
- FAQ icon: muted blue by default, orange when `.faq-item.open`, `line-height:1` for centering.

## JS conventions

- `main.js` shared across all pages — every DOM query needs null check before use.
- Carousel in `if (track) { … }`, hamburger in `if (hamburger && mobileMenu) { … }`, nav in `if (navEl) { … }`.
- Particles: COUNT=60, MAX_DIST=140, speed rand(-0.4,0.4), r rand(1.5,2.8), color 255,105,1, opacity 0.45, line alpha 0.18. No mouse interaction. Resize only reinitializes if dimensions actually changed.
- FAQ: measures `inner.scrollHeight`, sets `answer.style.maxHeight` directly.
- Testimonials: drag/swipe enabled (mouse + touch), 50px threshold, grab cursor. Autoplay every 6s, resets on interaction.
- Active nav: `hasScrolled` flag, handles both isIntersecting true and false.

## Portfolio page specifics

- Hero: 50vh, dark bg, just `<h1 class="hero-title">Portfolio</h1>`
- One unified grid, 3 cols desktop / 2 tablet / 1 mobile
- Status tags: `.proj-status--live` (orange, pulsing dot) top-right, `.proj-status--dev` (muted, still dot) top-right
- Card overlay: h4 (title) + `<p class="text">` (type)
- Nav on portfolio page: logo left, empty middle, discovery call right (no section links)

## Project links (portfolio)

Krachtzat (#), Grouptrips (grouptrips.ch), Nnuik (nnuik.nl), Laurens Logistiek Instructeur (ll-instructeur.nl), Sandy Roelfs (sandyroelfs.com), Level Up Vlaardingen (levelupvlaardingen.nl), Best Barbershop (bestbarbershop.nl), Nonverbale Communicatie (nonverbalecommunicatie.nu), Stichting Antipesto (antipesto.nl), Peakproteqt (#), Just Me Becoming (#).

## Git / deployment

- Do **not** push to GitHub unless the user explicitly says so.
- Deployed on Vercel, domain dyrodigital.com via Vimexx DNS.
- Remote has token in URL — do not log or expose it.
- Commit style: short version tags (v1, v2, v3...).
