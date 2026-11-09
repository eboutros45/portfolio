# Content

Projects and case studies live here as Markdown. Add a file and it gets its own page, a place on the homepage, a sitemap entry and its own link-preview metadata. Nothing else needs editing.

```
content/
  projects/<slug>.md        → project board on the homepage + /projects/<slug>
  case-studies/<slug>.md    → case-study row on the homepage + /case-studies/<slug>
```

The file name is the URL: lowercase words joined by dashes, e.g. `my-project.md`.

`npm run dev` reloads the page whenever you save a file. `npm run build` checks every file and stops with a message naming the file and field if something is wrong.

## Confidentiality rules (this text is public)

- No source code, repository links, screenshots or architecture details.
- No proprietary workflows, internal logic, data structures or strategy.
- No technology stack unless you have decided to make it public.
- No metrics, users, clients or results that are not real and verifiable.

## Project file

```markdown
---
name: FawarOS
order: 1                     # position on the homepage (lowest first)
category: Business Software / Product Engineering
status: functional           # functional | in-development | concept
statusNote: Experimental features in progress   # optional
summary: One sentence. Used on the homepage and in link previews.
origin: Restaurant floor     # short "where it came from"
role: Scope → design → build → iterate
focus: Product engineering, operations
visual: fawaros              # fawaros | idlab | backroom (abstract project figure)
disciplines:
  - Software product development
draft: false                 # true = visible in dev only
---

## Overview
Paragraphs…

## The problem
Paragraphs…

## My role
- One bullet per contribution

## What I learned
One paragraph per lesson.
```

All four `##` sections are required for projects.

## Case-study file

```markdown
---
title: "Lamma: a database-driven digital wallet"
order: 1                     # position in the case-studies list (after the project case studies)
type: concept                # product | automation | concept | other
project: null                # or a project file name (e.g. fawaros) to link it to that project
summary: One sentence.
draft: true                  # true = visible in dev only, hidden on the live site
---

## Any heading
Paragraphs, lists, **bold**, [links](https://example.com)…
```

Use as many `##` sections as you like. They become the page's table of contents. Raw HTML is ignored.
