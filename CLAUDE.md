# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

DyroDigital — single-page marketing website plus a separate `portfolio.html`. Vanilla HTML, CSS, and JavaScript. No frameworks, no build tools, no dependencies beyond Google Fonts and Font Awesome CDN.

Files:
- `index.html` — main page
- `portfolio.html` — full portfolio overview (separate page)
- `assets/css/style.css` — all styles
- `assets/js/main.js` — all JS (shared between pages)
- `assets/portfolio/` — project screenshots (.webp)
- `assets/images/` — testimonial avatars (.webp)
- `assets/logo/` — logo files

## Design rules

- **Units**: `rem` everywhere. Never `px` for spacing, font sizes, or dimensions.
- **Border radius**: `1rem` on all cards, inputs, and containers. `999px` for pill shapes (buttons, tags, badges). `50%` for circles (avatars).
- **Container padding**: `max(3rem, calc((100% - 1400px) / 2))` on wide screens. Tablet (`≤1024px`): `2rem`. Mobile (`≤768px`): `1rem`.
- **Transitions**: `0.35s ease-out` as the default. Testimonial track uses `0.45s cubic-bezier(.4,0,.2,1)`.
- **Colors** (CSS custom properties): `--accent:#ff6901`, `--bg:#0d1117`, `--surface:#161c26`, `--surface2:#1e2635`, `--text:#f0f2f5`, `--muted:#8892a4`, `--border:rgba(136,146,164,0.2)`.

## CSS conventions

- No comments unless the reason is non-obvious.
- Breakpoints: `1024px` (tablet, hamburger appears), `768px` (mobile), `600px` (stats single column).
- Service tag stagger on hover: `nth-child` `transition-delay` in 150ms steps (0 / 150 / 300 / 450ms).
- Portfolio card overlay: `align-items:flex-start` on `.proj-overlay` — never stretch tags full width.
- Stats grid: 3 columns desktop, 1 column at `≤600px`.
- Footer: 3-column grid desktop (`1fr auto 1fr`), flex column centered at `≤768px`.

## JS conventions

- `main.js` is shared across all pages. Every DOM query must be guarded with a null check before use (`if (el) { … }`), because elements like `#tTrack`, `#navHamburger`, and `#heroCanvas` do not exist on every page.
- The testimonial carousel is wrapped in `if (track) { … }`.
- Hamburger and mobile menu are wrapped in `if (hamburger && mobileMenu) { … }`.
- Floating nav and active nav link observer run on every page (they use `querySelector` which returns null safely for the observer, but nav scroll uses `if (navEl)`).
- Particle canvas (`#heroCanvas`): 60 particles, `MAX_DIST=140`, speed `rand(-0.4, 0.4)`, radius `rand(1.5, 2.8)`, color `255,105,1`, opacity `0.45`, line alpha `0.18`. No mouse interaction. Resize is debounced 150ms and re-calls `init()` to redistribute particles.
- FAQ accordion: measures `inner.scrollHeight` on `.faq-a-inner`, sets `answer.style.maxHeight` directly. Do not use CSS class toggling for height — it causes a two-step animation.
- Count-up stats: `IntersectionObserver` on `.stats-grid`, 1200ms duration, cubic ease-out, 120ms stagger per stat.
- Active nav links: `hasScrolled` flag prevents highlighting on initial page load. Observer handles both `isIntersecting: true` (highlight) and `false` (clear), so scrolling back to hero clears all highlights.

## Git / deployment

- Do **not** push to GitHub unless the user explicitly says so in that message.
- Remote uses a token in the URL — do not log or expose it.
