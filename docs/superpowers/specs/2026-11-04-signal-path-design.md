# Signal Path: second design direction for the portfolio

**Date:** 2026-11-04 · **Status:** awaiting review · **Owner:** Elie

## 1. Goal

Add a second, switchable design for the whole portfolio, called **Signal Path**. The current design (**Classic**) stays as it is.

Signal Path should read as **technical and personal**: an engineer's site, in Elie's own voice. It should look professional and leave a strong impression, with the projects as the showpiece.

Personality comes from copy, annotations and live details (the restaurant-floor origin story, live Beirut time, the "Currently" status). It never comes from soft or decorative styling.

**Success means:**
- Both designs run from one codebase, and switching between them is instant.
- Every project gets equal visual weight.
- A visitor understands who Elie is and what Elie builds within about 3 seconds of the first screen.
- Adding a project or case study means adding one Markdown file and nothing else.

**Out of scope for this round:**
- A `/admin` editor. The content structure must allow one to be added later without rework.
- Changing which design visitors see by default. Elie decides that later.
- New written content. Existing copy moves over word for word.

## 2. Switching between designs

- `src/content/designs.ts` exports `designs` (`classic`, `signal`) and `ACTIVE_DESIGN`, which starts as `'classic'`. It follows the same pattern as `ACTIVE_THEME`.
- The `?design=signal` or `?design=classic` URL parameter overrides the default. The choice is stored in `sessionStorage` (wrapped in try/catch) so it holds across page changes, and it is removed from the URL with `history.replaceState`.
- `DesignProvider` (React context) exposes the current design. `App.tsx` stays one router with the same routes. Each route element picks its page from the active design:
  - `/` → `Home`
  - `/projects/:slug` → `ProjectPage`
  - `/case-studies/:slug` → `CaseStudyPage`
  - `*` → `NotFound`
- Signal Path code lives in `src/designs/signal/` (pages, sections, components, `signal.css`). Classic stays in its current folders. The only Classic change is that it now reads content from the new content module (section 3), and its output must look identical.
- Signal's colours and type are scoped under `[data-design='signal']` on `<html>`, so the two designs' styles never interfere.
- Classic ignores standalone case studies. A `/case-studies/:slug` URL in Classic shows Signal's case-study page, kept simple, rather than a 404.

## 3. Content as Markdown

### Layout
```
content/
  README.md                ← confidentiality rules (moved from projects.ts) and how to add content
  projects/
    fawaros.md
    idlab.md
  case-studies/
    lamma.md               ← draft: true
    event-ticketing.md     ← draft: true
```
Site identity, contact, profile, skills, themes and the `explorations` list stay in their TypeScript files under `src/content/`. Only projects and case studies become Markdown, because they are the long-form, growing collections. Classic's Explorations section keeps reading `explorations` unchanged. The Lamma and Event Ticketing case-study drafts are separate, longer write-ups, so hiding a draft never removes anything from Classic.

### Project front matter
```yaml
name: FawarOS
order: 1                       # sort order on the homepage; ties broken by name
category: Business Software / Product Engineering
status: functional             # functional | in-development | concept
statusNote: null               # optional short qualifier
summary: One-sentence public description (used on boards and in SEO).
origin: Restaurant floor       # short "pin" shown on the board
role: Scope → design → build → iterate
focus: Product engineering, operations
visual: fawaros                # key into ProjectVisual
disciplines: [ ... ]
draft: false
```
The body is the case study, split into `## Overview`, `## The problem`, `## My role`, `## What I learned`. The `## My role` list becomes the current `contribution` field.

### Case-study front matter
```yaml
title: Lamma, a database-driven digital wallet
order: 3
type: concept                  # product | automation | concept | other
project: null                  # optional project slug; links the row to that board
summary: One sentence.
readingTime: auto              # worked out from word count
draft: true
```

### Content pipeline
- A Vite plugin, `plugins/content.ts`, reads `content/**` with `fs` and parses front matter (`gray-matter`). It converts the Markdown body to HTML (`marked`) and splits it at `##` headings to build the table of contents. The result is exposed as the virtual module `virtual:content`, and the files are watched during `npm run dev`.
- **Validation:** an unknown status, a missing required field, a duplicate slug, or a case study pointing to a project that doesn't exist all **fail the build** with an error naming the file and field.
- **Drafts:** `draft: true` items show in `npm run dev` with a dashed "DRAFT" marker, the same pattern as the contact placeholders. They are left out of the production build, the sitemap and SEO pages, and the build prints a list of them.
- `plugins/seo.ts` reads the same loader, so case-study routes get their own HTML files with correct meta tags and sitemap entries.
- `src/content/projects.ts` re-exports `projects` from `virtual:content` with types, and keeps its current exports (`getProject`, `projectIndex`, `statusLabel`, and `explorations`, still defined in TypeScript). Classic needs no other changes.
- Markdown is converted to HTML at build time and comes only from the repo, which Elie controls. It is inserted with `dangerouslySetInnerHTML`, and raw HTML in the Markdown is disabled.

## 4. Signal Path: visual system

### Tokens
| Token | Value | Use |
|---|---|---|
| `bg` | `#0a0e0d` | page background |
| `raise` | `#0f1514` | boards, panels |
| `line` / `line2` | `#1c2925` / `#2a3b36` | borders, inactive trace |
| `tx` | `#e9efec` | headings (L1–L3) |
| `mu` | `#9aa9a3` | body text (L4) |
| `fa` | `#6f7f79` | metadata (L5); must still be ≥4.5:1 on `bg`, checked at build, lightened if needed |
| `sig` | `#c8f169` | signal accent |

### Type hierarchy (every element uses exactly one level)
| Level | Use | Spec |
|---|---|---|
| L1 | Hero headline, case-study title. Once per page | Space Grotesk 500, `clamp(2.75rem, 7vw, 5.5rem)`, −4% tracking |
| L2 | Section titles | Space Grotesk 500, `clamp(1.75rem, 3.6vw, 3rem)` |
| L3 | Project names, case-study H2s | Space Grotesk 500, `clamp(1.25rem, 2.4vw, 2.125rem)` |
| L4 | Ledes, summaries, body | Inter 400, 15–17px, line-height 1.6, max width 65 characters, `mu` |
| L5 | Eyebrows, labels, pins, nav, timestamps | JetBrains Mono, 10–11px, uppercase, +8–10% tracking, `fa` |

Fonts are installed as `@fontsource-variable` packages, not loaded from Google.

### Emphasis rules
- **Accent budget:** `sig` means "live / active / act here" and nothing else. It is used for the lit trace, the active nav point, the powered board, status dots and primary buttons. It is never used for headings or body text. At most one filled button per screen.
- **Hierarchy comes from size and tone,** not from extra boxes and borders.
- **Weight by section:** Hero > Work > Contact > About > Skills. About, Experience and Skills use L2 at its smaller end and never glow.

## 5. Signal Path: pages

### Navigation
- A fixed top bar with the name and the test points **TP1 Intro · TP2 Work · TP3 Case studies · TP4 About · TP5 Contact**. The active point lights up, and a 1px signal line along the bottom edge shows scroll progress.
- The circuit trace is decoration only. It is never needed to find your way around.
- **⌘K / Ctrl+K** opens a small jump menu with sections, projects and case studies. It is reachable by keyboard and closes on Esc, and focus moves into it and back.
- Mobile: a menu button opens the same list as a full-screen sheet.

### Home: TP1 Hero
- An L5 meta strip: Beirut local time (the existing `LocalTime` component), `LAU · CE '29`, and the **availability** line.
  - `availability` is a new field in `site.ts`. It starts as `null` (hidden) and shows a placeholder marker in dev until Elie fills it in.
- The L1 headline uses `site.statement`, with one phrase in `sig`.
- The L4 lede combines `about.lead` with the operations origin. It is assembled from existing copy, and any new sentence is marked for Elie's review.
- One primary call to action ("See the work") and one secondary ("Get in touch").
- A "Currently" panel lists the `currently` items.

### Home: TP2 Work (layout A, equal weight)
- One **full-width board per project**, in `order`, with identical anatomy. The board header shows the U-number, category and status. The text side shows name (L3), summary, origin, role, focus and an "Open case study" button. The figure side shows the `ProjectVisual`.
- The figure alternates sides from row to row.
- **"Powered" just marks the board you're viewing.** It is set by an IntersectionObserver, and only one board is powered at a time.
  - A powered board gets a `sig` border, its figure animates, and its button is filled. Unpowered boards are fully readable, just not glowing.
  - Keyboard focus or a tap powers a board straight away.
  - Content is never hidden behind the animation.
- A vertical trace on the left joins the boards and lights up to match scroll position.

### Home: TP3 Case studies
- A reading-first index under the projects, as a table: `CS-0n`, title and one-line summary, type tag, related project, reading time, and an arrow.
- It lists **both** project case studies (linking to `/projects/:slug`) and standalone ones (linking to `/case-studies/:slug`), with equal weight, in `order`.
- Hovering or focusing a row that has a related project lights that project's board marker.
- Mobile: rows stack, and type, related project and reading time move under the title.

### Home: TP4 About, Experience, Skills
These use the existing copy and stay quieter. Skills show as mono tags, and Experience and Education use a compact datasheet layout.

### Home: TP5 Contact
An L2 headline. **Email** is the one filled button. LinkedIn and GitHub are secondary, and null links follow the existing hide-in-production rule.

### Project page (`/projects/:slug`) and case-study page (`/case-studies/:slug`)
- **Transition:** the clicked board scales into view and the page settles. With reduced motion this becomes a plain fade.
- **Header:** a breadcrumb (`← Board / U1 FawarOS`), then a status eyebrow, the L1 title and a key-facts strip (type, role, origin).
- **Body:** sticky contents on desktop (built from the `##` headings) next to the article (H2 at L3, body at L4, max 65 characters per line), with the full-width animated figure after the Overview.
- **Footer:** previous and next links (projects first, then case studies, in `order`).
- **SEO:** each page gets a title and description from `summary`.

### Mobile (< 768px)
- The trace becomes a left rail with section nodes.
- Boards stack full-width with the figure on top.
- Nothing depends on hover, and tap targets are at least 44px.

## 6. Motion and accessibility
- The trace draws with `stroke-dashoffset` tied to scroll progress (motion `useScroll`). SVG and CSS only, no WebGL or canvas.
- **Reduced motion:** the trace appears fully drawn, boards show their resting state, figures stay still, and page transitions become plain fades. This covers both the OS setting and the existing `MotionConfig reducedMotion="user"`.
- Keep the existing skip link, visible focus rings, landmarks and `aria-labelledby` on sections. The ⌘K dialog uses `role="dialog"` with a focus trap.
- Text contrast is at least 4.5:1, and `sig` is never used as a text colour on light surfaces.
- Lenis smooth scrolling stays.

## 7. Error handling
- A content problem fails the build with the file and field named (section 3).
- An unknown slug shows the active design's 404 page.
- An unknown `?design=` value falls back to `ACTIVE_DESIGN`, with a console warning in dev.
- If `sessionStorage` is unavailable, the design still applies for the current page view.
- The existing `ErrorBoundary` wraps both designs.

## 8. Testing and verification
- `npm run build` passes: type-check, content validation and the SEO pages for every non-draft route.
- **Classic regression:** before and after screenshots of `/` and both project pages at 1440px and 390px must match visually.
- **Signal manual check, desktop and 390px:**
  - nav highlighting and progress line
  - board powering by scroll, focus and tap
  - case-study index links and the board-marker highlight
  - both detail pages, previous/next, and ⌘K
  - the reduced-motion pass and keyboard-only navigation
- **Content check:** add a throwaway `content/case-studies/test.md` and confirm it gets a page, an index row and a sitemap entry, and that leaving out a required field fails the build. Then remove it.

## 9. Open items for Elie (do not block the build)
- `site.availability` wording ("Open to internships" or something else). It stays hidden until set.
- Writing the two draft case studies (Lamma, Event Ticketing). They stay hidden on the live site until `draft: false`.
- Reviewing any new lede or case-study index sentences, which are marked `REVIEW:` in the content.
- Deciding when to switch `ACTIVE_DESIGN`.
