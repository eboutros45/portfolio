# elieboutros.dev

Personal portfolio of **Elie Boutros**, Computer Engineering student and software developer.

React · TypeScript · Vite · Tailwind CSS v4 · Motion · Lucide. Static site, deployed on Cloudflare Pages.

---

## 1. Install

Requires **Node.js 20.19+ or 22.12+** (`.nvmrc` pins 22).

```bash
npm install
```

## 2. Develop

```bash
npm run dev
```

Opens on http://localhost:5173. In dev mode, contact links that are still placeholders show as dashed "placeholder" boxes.

## 3. Production build

```bash
npm run build      # type-checks, then builds into dist/
npm run preview    # serves dist/ locally on http://localhost:4173
```

The build output in `dist/` includes:

| File | Purpose |
| --- | --- |
| `index.html` | Homepage, with homepage meta tags |
| `projects/fawaros.html`, `projects/idlab.html` | Same app shell with **route-specific** title, description and Open Graph tags, so link previews are correct |
| `sitemap.xml` | Generated from the project list |
| `robots.txt`, `_headers`, `favicon.svg`, `apple-touch-icon.png`, `og-image.png` | Copied from `public/` |

If any contact detail is still a placeholder, the build prints a warning.

## 4. Push to GitHub

```bash
git add .
git commit -m "Initial portfolio"
# Create an empty repo on github.com first (no README), then:
git remote add origin https://github.com/<your-username>/elieboutros.dev.git
git push -u origin main
```

The repository can be **private**. Cloudflare Pages works with private repos.

## 5. Deploy on Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Pick the repository and the `main` branch.
3. Build settings:
   - **Framework preset:** Vite (or None)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Environment variable (optional):** `NODE_VERSION` = `22`
4. **Save and Deploy.** Every push to `main` redeploys. Pull requests and other branches get preview URLs.

### How routing works on Pages

- `/projects/fawaros` is served from `dist/projects/fawaros.html` (Pages drops the `.html` extension automatically). Direct visits and refreshes work and return real metadata.
- The project has **no top-level `404.html` on purpose**. Without one, Pages treats the site as a single-page app and serves `index.html` for unknown paths, where the app renders its own 404 page (marked `noindex`).
- `public/_headers` sets security headers and long-term caching for hashed files in `/assets/`.

## 6. Connect `elieboutros.dev`

1. In the Pages project → **Custom domains** → **Set up a custom domain** → enter `elieboutros.dev`.
2. **If the domain's DNS is on Cloudflare** (recommended; you can transfer or register `.dev` at Cloudflare Registrar), the CNAME record is created for you.
   **If DNS is elsewhere**, add the record Cloudflare shows you: a `CNAME` from `elieboutros.dev` (or `@`) to `<project>.pages.dev`. Apex CNAMEs require a provider that supports CNAME flattening/ALIAS; otherwise move the DNS to Cloudflare.
3. Optionally add `www.elieboutros.dev` as well, and create a redirect rule (Rules → Redirect Rules) from `www` to the apex.
4. `.dev` domains are HTTPS-only (HSTS preloaded). Cloudflare issues the certificate automatically, usually within minutes.

Optional: Cloudflare **Email Routing** can forward an address like `hello@elieboutros.dev` to your personal inbox, so you never publish your private address.

## 7. Updating content

All text lives in **`content/`** (Markdown) and **`src/content/`**, so you never need to touch the components to update it.

| File | What it contains |
| --- | --- |
| `content/projects/*.md` | One file per project: board facts + case-study text. See `content/README.md` |
| `content/case-studies/*.md` | Standalone case studies (`draft: true` = dev only) |
| `src/content/site.ts` | Name, role, statement, SEO description, **contact links** and the `availability` line |
| `src/content/projects.ts` | Explorations list; adapts the Markdown for the pages |
| `src/content/profile.ts` | About, Experience, Education, Skills |

### Designs

Two complete designs share the same content and routes: **Classic** and **Signal Path**.

- **Live direction:** Signal Path. The floating design switch is removed, and saved or URL-based design previews are ignored.
- **Choose one:** set `ACTIVE_DESIGN` in `src/content/designs.ts`.
- Signal Path's wording that isn't in your profile is in `src/designs/signal/copy.ts`, marked `REVIEW`.

### Colour scheme

Five schemes are built in: Charcoal, Paper, Stone + Signal, Sage and Cobalt.

- **Preview them:** open the site with `?themes` in the URL, e.g. `http://localhost:4173/?themes` or `https://elieboutros.dev/?themes`. A swatch picker appears at the bottom of the screen and is remembered for that tab. It also always shows in `npm run dev`. Normal visitors never see it.
- **Choose one:** set `ACTIVE_THEME` in `src/content/themes.ts`. The build bakes it into the HTML, so there's no flash of the wrong colours.
- **Tweak a palette:** edit its `[data-theme='…']` block in `src/styles/index.css`.

### Contact placeholders (still to fill in)

In `src/content/site.ts`:

```ts
export const contact = {
  email: null,     // e.g. 'hello@elieboutros.dev'
  linkedin: null,  // e.g. 'https://www.linkedin.com/in/your-handle'
  github: null,    // e.g. 'https://github.com/your-handle'
}
```

Links left as `null` are hidden on the live site. Once set, they appear in the Contact section and in the homepage's structured data (`sameAs`).

### Add a project

1. Copy `content/projects/fawaros.md` to `content/projects/<slug>.md` and edit it. The fields are explained in `content/README.md`.
2. It automatically gets a homepage board, a case-studies row, a page at `/projects/<slug>`, a sitemap entry and its own meta tags.
3. For `visual`, reuse `fawaros` / `idlab`, or add a new abstract composition in `src/components/ProjectVisual.tsx` (and its key in `src/content/types.ts`).

`npm run build` checks every content file and stops with the file and field named if something is missing.

### Add a case study

Add `content/case-studies/<slug>.md` (see `content/README.md`). Keep `draft: true` while writing; it shows in dev only.

### Confidentiality checklist (before publishing a change)

- No source code, repo links, screenshots, or architecture diagrams for private projects.
- No proprietary workflows, internal logic, data models, or strategy.
- No technology stack unless you have chosen to make it public.
- No metrics, clients, or results that are not real.
- Statuses stay accurate: `functional`, `in-development`, or `concept`.

### Regenerating the share image

`public/og-image.png` (1200×630) and `public/apple-touch-icon.png` (180×180) were rendered from HTML using the site's Geist font. Replace them with any image of the same size if you redesign them.

---

## Project structure

```
content/         ← projects + case studies as Markdown
plugins/         ← build plugins: content loader (virtual:content), SEO pages
src/
  designs/signal ← the Signal Path design (lazy-loaded with its own fonts/CSS)
  content/       ← site, profile, designs, themes; types for the Markdown
  components/    ← Nav, Footer, motion primitives, StatusMark, ProjectVisual…
  sections/      ← homepage sections, in page order
  pages/         ← Home, ProjectPage (code-split), NotFound
  hooks/         ← useDocumentMeta (client-side title/meta sync)
  lib/           ← route metadata, scroll helpers, lazy route loaders
  styles/        ← design tokens + base styles (Tailwind v4 @theme)
plugins/seo.ts   ← build step: per-route HTML, sitemap, placeholder warnings
public/          ← favicon, OG image, robots.txt, Cloudflare _headers
```

## Design notes

- **Type:** Geist (sans and mono), self-hosted via Fontsource, so there are no third-party font requests.
- **Colour:** three light schemes (Paper, Stone + Signal, Sage). All body text meets WCAG AA. See "Colour scheme" above.
- **Grid:** 12 columns on desktop, 4 on mobile.
- **Layout & motion:**
  - Hero: the name is scaled by `useFitText` to span the full width exactly. Letters rise one by one; on scroll the two lines slide apart. On wide screens the statement and CTAs sit beside "ELIE", with a live "Currently" block below.
  - Marquee: interests scroll endlessly, speed up with scroll velocity and reverse when you scroll back up.
  - Selected Work: sticky stacking cards. Each pins while the next slides over it, and the cards beneath recede. On mouse devices a "View" bubble follows the cursor, and the project visual animates while the card is in view.
  - Explorations: dashed "sketch" cards (not built yet) whose outline firms up on hover.
  - About: the lead paragraph lights up word by word as you scroll.
  - Skills: spec-sheet rows with a fill sweep on hover.
  - Contact: "LET'S CONNECT." letters ripple on hover.
  - Footer: the full name set edge to edge and cropped.
  - Nav: a floating pill whose indicator slides to the section in view.
  - Everywhere: Lenis smooth scrolling, magnetic buttons, and a curtain page transition.
  - Reduced motion: all of it is disabled for visitors who prefer it.
- **Project visuals:** abstract, seeded SVG compositions. They are deliberately not product interfaces.
- **Accessibility:** semantic landmarks, skip link, visible `:focus-visible` outlines, labelled sections, and status that is always written out rather than shown only as a symbol.
