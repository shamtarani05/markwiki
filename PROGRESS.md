# Development Progress

Last Updated: 2026-09-14

## Current Status: Phase 1 Complete

Database schema architecture finalized. Ready for Phase 2.

---

## Phase 1: Design & Architecture ($110)
**Status**: Complete

### Tasks
- [x] Design database schema for:
  - [x] Users (admin, editor, contributor, reader roles)
  - [x] Categories (hierarchical, for wiki organization)
  - [x] Pages (wiki articles with revision support)
  - [x] Revisions (edit history tracking)
  - [x] Books (title, synopsis, cover, author, status, metadata)
  - [x] Chapters (content, order, book reference, published status)
  - [x] Blog Posts
  - [x] Short Stories
  - [x] Comments (with threading support)
  - [x] Reactions (like/dislike system)
  - [x] Ad Placements (zones, types, configurations)
  - [x] Affiliate Links
  - [x] Media (image/file storage)
  - [x] Submissions (contribution workflow)
  - [x] Reading Progress
  - [x] Site Config (navigation, homepage, theme)
- [x] Set up MongoDB connection
- [x] Create environment configuration
- [x] Plan file/folder architecture

### Schema Files Created
```
src/lib/db/
├── connection.ts
└── models/
    ├── index.ts
    ├── User.ts
    ├── Category.ts
    ├── Page.ts
    ├── Revision.ts
    ├── Book.ts
    ├── Chapter.ts
    ├── BlogPost.ts
    ├── ShortStory.ts
    ├── Comment.ts
    ├── Reaction.ts
    ├── AdPlacement.ts
    ├── AffiliateLink.ts
    ├── Media.ts
    ├── Submission.ts
    ├── ReadingProgress.ts
    └── SiteConfig.ts
```

### Notes
- Wiki-style functionality added (Page, Revision models)
- Revision system supports edit history for all content types
- SiteConfig model for admin-controlled navigation/homepage/theme

---

## Phase 2: Core Publishing System & Full CMS ($290)
**Status**: In Progress

### Design References
- Homepage: Raddito Agency (Dribbble) - Hero + category sections
- Reader Dashboard: Bookshelf UI with progress tracking

### Development Order
1. Homepage (public)
2. Admin Panel (manage homepage, content)
3. Reader Portal (reading, bookshelf, progress)
4. User Portal (create content, submit for review)

### Tasks
- [ ] **Homepage (Long scrolling, SEO-focused)**
  - [x] Hero section (editable from admin)
  - [x] Category sections (Books, Blogs, Stories, Novels) - Styled with premium Cosmic glassmorphism
  - [x] Featured content carousels
  - [x] "Publish Your Book" CTA section
  - [x] User signup/login prompt
  - [x] Ad placement zones
  - [x] Dark/Light theme support - Cosmic Violet Nebula Glow theme applied globally
  - [x] Fully responsive

- [ ] **Reader Portal**
  - [x] Book detail page with cover animation
  - [x] Chapter reading page (distraction-free)
  - [x] Table of contents navigation
  - [x] Bookshelf (saved books)
  - [x] Reading progress tracking (%, hours)
  - [x] Continue reading feature - Dynamic data integration complete
  - [x] Guest reading (no account required)
  - [x] Category Domain Pages (Dynamic `/category/[slug]`)

- [ ] **Admin Panel / CMS** — see full architecture checklist below
  - [x] Admin authentication
  - [x] Dashboard overview
  - [x] Page-builder canvas (drag-and-drop blocks, per content type)
  - [x] Book/Webtoon/Blog management (Short Story pending)
  - [x] Chapter editor (WYSIWYG)
  - [x] Category management (API exists, Admin UI pending)
  - [x] Ad placement management
  - [ ] SEO manager
  - [x] Navigation editor
  - [x] Theme customization

- [ ] **User Portal (after reader portal)**
  - [x] User dashboard (Reads wikis/pages)
  - [ ] Create book/story/novel/blog (Only wiki/pages supported)
  - [ ] Add chapters with cover
  - [x] Submit for admin review (Wiki flow done)
  - [ ] Content moderation (security checks)
  - [ ] Profanity/inappropriate content filter

### Notes
- About page is separate from homepage
- Non-logged users can read but not save progress
- All homepage sections editable from admin
- Content security validation before publishing

---

## Admin CMS — Page-Builder Architecture (added 2026-08-30)

Client feedback: the admin/CMS is not a set of fixed edit-forms — it's a drag-and-drop
page builder. Every page (homepage, every wiki page, every book/chapter/blog/story
landing page) is assembled from movable blocks, saved to the DB, and each content
type gets its own block palette since wikis, novels, webtoons, and blogs each have
different reading/viewing needs. "The system works the way the admin wants — the
admin doesn't work the way the system wants."

Reference image the client sent is a generic SaaS dashboard (sidebar + folder/table
list + card-based detail panel) — **layout/IA reference only, not colors.** Admin UI
uses this project's own theme tokens (`app/globals.css`), not the screenshot's
blue/white palette.

### IA patterns worth borrowing from the reference
- [ ] Left sidebar grouped by section (Dashboard / Contents / Catalog / Pages / Admin / Links), collapsible
- [ ] Top bar: search + admin profile menu
- [ ] List views: table with checkbox multi-select, bulk actions, sort/filter, "last modified" column
- [ ] Detail/edit views: main canvas (majority width) + right-hand metadata/properties panel (mirrors the patient-profile card layout)

### Per-content-type checklist (each needs its own block palette + preview)
- [x] Wiki Page — done 2026-08-31. A wiki (franchise container, its own `Wiki` model)
      has many pages, not one — Overview, Character, Location, and Episode/Chapter are
      the 4 starter archetypes (`src/lib/blocks/templates.ts`), each with its own
      infobox fields, generic across every topic category (an Anime wiki's Character
      page and a Video Game wiki's Character page start from the same archetype).
      Confirmed against how real Fandom wikis are actually organized (one wiki per
      franchise, many categorized pages inside it — Community Central's own
      Help:Categories/Help:Navigation docs), not just inferred from the one sample
      page in the codebase.
- [x] Book (novel/serialized fiction) — cover, synopsis, genre tags, chapter list/reorder
- [x] Chapter — reader-focused blocks (text, image, author's note, next/prev nav)
- [x] Webtoon — Implemented via `format: 'text' | 'webtoon'` flag on Book, allowing vertical image-strip chapters.
- [x] Blog Post — Implemented with a dedicated editor, listing, and public routes.
- [x] Short Story — Implemented with the PageBuilder Block interface.
- [x] Homepage — Migrated to the Block schema and PageBuilder-style Admin UI.

### Drag-and-drop block library (shared building blocks across content types)
- [ ] Rich text, Heading, Image, Image gallery, Video embed, Quote/callout
- [ ] Infobox (wiki), Table of contents, Card grid, Carousel
- [ ] CTA button, Newsletter signup, Comments block
- [ ] **Ad slot** — a placeable block referencing `AdPlacement`, not just a hardcoded zone (this pulls Phase 3/4 ad-placement work forward architecturally, even though ad *content* management stays Phase 3)
- [ ] Per-block settings panel (spacing, visibility, alignment) editable without code

### Data model gap (current schemas are rigid, not block-based)
- [x] `Page.blocks: Block[]` — done 2026-08-30. `Page.content` replaced with an ordered
      block array (`src/lib/db/models/Page.ts`); block types/props live in
      `src/lib/blocks/types.ts` as a discriminated union (14 block types: heading,
      richText, image, gallery, videoEmbed, quote, infobox, tableOfContents, cardGrid,
      carousel, ctaButton, newsletter, comments, adSlot). A pre-save hook flattens
      text-bearing blocks into `Page.searchText` so the existing text index still works
      without parsing block HTML at query time.
- [ ] `Chapter`/`BlogPost`/`ShortStory`/homepage still use their old rigid shape —
      not yet migrated onto `blocks` (Phase 2 order: Book/Chapter next, see below)
- [ ] Decide: migrate `Page`/`Chapter`/`BlogPost`/`ShortStory`/homepage onto one shared
      layout schema, or give each its own block-type union — affects how much of the
      builder UI can be shared vs. built per type
- [x] Reconcile with `Revision` model — done 2026-08-31, resolved as **full-layout
      snapshot per revision**, not per-block diffing. `src/lib/db/pageRevisions.ts`
      snapshots the page's pre-edit `title`+`blocks` (JSON-serialized into `Revision`'s
      existing `content: string` field) every time `PATCH /api/admin/pages/[id]` saves,
      tagged with an optional edit summary. `POST /api/admin/pages/[id]/revisions/
      [revisionId]/rollback` restores a page to an old revision and — matching standard
      wiki behavior — snapshots the pre-rollback state too, so a rollback is itself
      reversible. `app/admin/wiki/[id]/history` lists revisions with a restore button.
      Verified end-to-end (edit → edit → rollback → new revision recorded).
- [ ] Reconcile `SiteConfig.theme` (hex fields) with the CSS-variable theme system in
      `app/globals.css` — right now they're two disconnected sources of truth
- [x] `Page.pageType` — done 2026-08-31. Stores which archetype (`overview` |
      `character` | `location` | `episode` | `blank`) the page uses; the infobox itself
      lives inside the page's own `infobox` block (block props), not a separate stored
      field — the archetype only decides which blocks a new page starts with.
- [x] New `Wiki` model — done 2026-08-31 (`src/lib/db/models/Wiki.ts`). The franchise
      container (name, slug, description, cover, linked to a topic `Category`) that
      groups a wiki's many pages together; `Page.wiki` is now a required ref, and
      `Page.slug` uniqueness is scoped per-wiki (compound index), not global, matching
      the public `/wiki/[wikiSlug]/[pageSlug]` URL shape.
- [x] `Category` seeding — done 2026-08-31. The 8 homepage categories only ever lived
      as a hardcoded array in `CategorySection.tsx`; `GET /api/admin/categories` now
      seeds them into the real `Category` collection (idempotent) so the Wiki-creation
      form has real categories to attach to. The per-category archetype/template link
      idea (`allowedPageTypes`) was dropped in favor of `Page.pageType` above — simpler,
      and matches archetypes being generic across categories rather than owned by one.

### Open decisions
- [x] **Drag-and-drop library**: `dnd-kit` — decided 2026-08-30
- [x] **How "free" is freehand?**: Constrained blocks — free arrangement/reorder/resize
      and per-block settings (spacing, alignment, theme colors), no raw CSS/HTML —
      decided 2026-08-30
- [ ] Who can use the builder — admin only, or editor/contributor roles too (ties into
      the existing `User` role system and the Phase 4 submission/review flow)
- [x] **Versioning UX**: every save creates a `Revision` (with edit summary) — decided
      and implemented 2026-08-31, see "Reconcile with Revision model" above. A page
      also separately has its own `status: draft | published | archived`, unaffected
      by revisions — revisions are edit history, status is publish state.

### Suggested build order (Phase 2 scope: Wiki Pages + Books/Chapters only — see
"Phase 2 CMS scope narrowed" in the Decisions Log; the 8 categories researched below
are topic tags on `Page`, not separate builds)
1. [x] Shared block/layout schema + Mongoose model — `Page.blocks`, done 2026-08-30
2. [x] Block registry — `src/components/blocks/BlockRenderer.tsx`, done 2026-08-30.
   One renderer, shared by the admin canvas's block previews, the admin Preview
   toggle, and (once step 4 below is done) the public page — so admin preview
   matches the live page exactly, not an approximation
3. [x] Admin canvas shell for **Wiki Page** — done 2026-08-30, `src/components/admin/builder/`:
   - `PageBuilder.tsx` — orchestrator (title, blocks, Edit/Preview toggle, Save)
   - `TemplatePicker.tsx` — Blank / Books & Literature / Anime starters (`src/lib/blocks/templates.ts`) — pre-fill only, every block stays fully editable/removable after
   - `BlockPalette.tsx` — click to add any of the 14 block types
   - `SortableBlock.tsx` — dnd-kit drag-to-reorder, duplicate, delete
   - `PropertiesPanel.tsx` — per-block-type settings form
   - `RichTextEditor.tsx` — constrained toolbar (bold/italic/list/link/quote) over a sanitized HTML block, not a raw HTML field
   - Routes: `app/admin/wiki/new` (WikiPicker → PageBuilder → POST `/api/admin/pages`) and `app/admin/wiki/[id]/edit` (GET/PATCH `/api/admin/pages/[id]`, edit summary, "View history" link) — verified end-to-end against a real local MongoDB (create → persist → reload → edit → rollback)
   - Still open: admin auth (still "Pending" in Technical Decisions) isn't wired, so writes go through a placeholder system-author user (`src/lib/db/getSystemAuthor.ts`, TODO-marked); no delete endpoint yet; the palette is click-to-add rather than drag-from-palette-to-canvas (reordering already-placed blocks is real drag-and-drop; inserting new ones via drag would be a polish pass, not a functional gap)
4. [x] **Admin dashboard shell** — done 2026-08-31, built ahead of item 5 below on
   client feedback ("dashboard first, then editors — don't ship isolated create
   flows"). `app/admin/layout.tsx` is its own root layout (own `<html>`/`<body>`,
   NOT wrapped in the public site's Header/Footer — see the `app/(site)/` route-group
   split below), rendering `AdminSidebar` (full planned IA from the "IA patterns"
   checklist above — Wikis/Pages are live links, Books/Blog/Categories/Ads/etc. show
   as greyed-out "soon" rows rather than dead links) and `AdminTopBar`.
   - `app/admin` — dashboard home: stat cards (wikis/pages/drafts/published), recent-activity list
   - `app/admin/wikis` — table of all wikis, links into a wiki-filtered page list
   - `app/admin/pages` — table of all pages (title, wiki, archetype, status), filterable by `?wikiId=`
   - `WikiPicker.tsx` — pick an existing wiki or create one inline (name + topic category); the
     `/admin/wiki/new` flow now starts here, then hands off to the template/archetype picker
   - `Category` auto-seeds via `GET /api/admin/categories` (see above) so the wiki-creation
     form has real data instead of an empty dropdown
   - **Restructured routing to make this possible**: moved the public site (`app/page.tsx`,
     `app/wiki/`, `app/layout.tsx`) into `app/(site)/` as its own root layout, since Next.js
     only allows one root layout per top-level `app/layout.tsx` — splitting into two
     route-group root layouts (`(site)` and `admin`) is what let the admin portal drop the
     public nav chrome entirely. Verified the public site still renders its Header/Footer
     correctly after the move.
5. [ ] Wire the **public** wiki page route (`app/(site)/wiki/[wikiSlug]/[pageSlug]/page.tsx`) to
   fetch a real `Page` by slug and render its `blocks` through the same `BlockRenderer`,
   replacing the hardcoded mock data — this is what puts admin-built pages in front of
   readers, and hasn't been done yet. Next up.
6. [ ] Roll the same canvas out to **Book/Chapter** (novels) — needs its own admin flow
   (cover/synopsis/genre metadata form + orderable chapter list + a simpler per-chapter
   editor), not a reuse of the Wiki Page block canvas — confirmed with client, book
   creation is "totally different" from wiki article creation
7. [ ] Ad-slot block wired to `AdPlacement` — the `adSlot` block exists and takes a zone,
   but still renders the same static "Advertisement" placeholder as the homepage
   (`AdBanner.tsx`); pulling real `AdPlacement` documents stays Phase 3

### Category-specific page templates (researched from real wiki conventions)

Researched against Fandom's actual conventions (Community Central help docs + real
category/franchise wikis), since this project is explicitly Fandom-structured. Each
category needs more than one page archetype, not a single generic template — the
generic infobox already in `WikiPageLayout.tsx` only really matches Anime/Web Novels.
The Wiki Page's block/infobox system (step 3 above) needs to be flexible enough
(configurable infobox fields, optional blocks like Stat Block or Episode Navigator) to
serve all eight categories, since they're topic tags on the same `Page`/`Category`
models, not separate content types — the per-category detail below is what that
flexible system needs to be able to express, not a checklist of eight separate builds.

- [ ] **Anime**
  - Archetypes: Series page, Character page, Episode page
  - Infobox fields: Series — Japanese title, studio, director, air dates, episode count. Character — image, Japanese name, voice actors (JP/EN), age, species, affiliations, family, first/last appearance
  - Body sections: Synopsis, Character list, Episode list (prev/next nav), Abilities/Powers, Trivia, Gallery
  - Extra block type: **Episode Navigator** (prev/next + season grid)

- [ ] **Web Novels**
  - Archetypes: Series page, Character page, Volume/Arc index, Chapter page
  - Infobox fields: Series — author, translator, status (ongoing/completed/hiatus), volume count, genre tags
  - Body sections: Synopsis, Volume → Arc → Chapter hierarchy (nested list, not flat), Characters, World-building/Glossary
  - Extra block type: **Volume/Arc Tracker** (nested, prose-oriented — distinct from Webtoon's tracker below)

- [x] **Webtoons**
  - Archetypes: Series page, Character page, Chapter page (image-strip, not prose)
  - Infobox fields: platform (e.g. LINE/Naver), artist vs. writer (often different people), release day/schedule, chapter count
  - Body sections: Synopsis, vertical Chapter gallery/release tracker (flat, by release date — no volume grouping), Characters, Gallery
  - Extra block types: **Episode/Chapter Tracker** (flat, date-driven, thumbnail grid — not the nested volume/arc tracker Web Novels need) and a **Vertical Image Strip** reader block distinct from the prose Chapter block

- [ ] **Video Games**
  - Archetypes: Game page, Character page, Item/Weapon page, Location page, Walkthrough/Quest page
  - Infobox fields: Game — platform, developer, publisher, release date, genre. Character — voice actor, affiliations, role. Item — type, stats, rarity, where obtained. Location — region, connected areas, inhabitants
  - Body sections: Overview, Gameplay mechanics, Walkthrough (step-by-step), Trivia, Gallery
  - Extra block type: **Stat Table** (generic key/value or column stat grid, reusable for items too)

- [ ] **Trading Cards**
  - Archetypes: Set/Expansion page, individual Card page, Character/Archetype page
  - Infobox fields: card name, set, rarity, card type/subtype, cost/mana, power/toughness or HP, rulings/errata
  - Body sections: Card text/rules text, Rulings, Where to obtain (set/pack), related cards
  - Extra block type: **Card Database Table** (sortable/filterable by set, rarity, type — this is the most structurally distinct category, closer to a database view than a prose article)

- [ ] **Movies & TV**
  - Archetypes: Film page, Series page, Season page, Episode page, Cast/Character page
  - Infobox fields: Film — director, writer, starring, runtime, release date, box office. Series — showrunner, network, season/episode counts. Episode — air date, writer, director, prev/next
  - Body sections: Plot, Cast list, Episode table (per season, numbered), Production notes, Reception
  - Extra block type: **Episode Table** (season-grouped, sortable by air date) — can likely share the Anime Episode Navigator block with a table-view variant

- [ ] **Books & Literature**
  - Archetypes: Book page, Series page, Character page
  - Infobox fields: author, publisher, genre, page count, ISBN, series/volume number, preceded-by/followed-by
  - Body sections: Plot summary, Characters, Themes, Reception/Awards
  - Extra block types: none beyond the generic library — this category maps almost 1:1 onto the existing Wiki Page infobox + sections template

- [ ] **Tabletop & RPG**
  - Archetypes: Game/System page, Monster/Creature page, Character Class page, Rules/Mechanic page
  - Infobox fields: system, publisher, edition, player count, complexity/level
  - Body sections: Overview, Rules text, Tactics/Strategy, Lore/Flavor text
  - Extra block type: **Stat Block** (D&D-style formatted box: AC, HP, Speed, ability scores, saving throws, skills, senses, languages, challenge rating, actions/reactions — this is a fixed, recognizable format players expect, not free-form prose)

**Not a Phase 2 pilot list.** Phase 2's actual pilot is the generic Wiki Page block/
infobox system itself (topic-agnostic — done, see "Suggested build order" above), not
any one category. The Books & Literature and Anime starter templates in
`src/lib/blocks/templates.ts` were picked first simply because they need the least
extra block-type work to look right; Trading Cards, Tabletop & RPG, and the
Webtoon-vs-Web-Novel chapter trackers are the structurally hardest (database-table-like
card pages, fixed-format stat blocks, divergent chapter hierarchies) and are better
tackled once the shared block registry is proven on the simpler categories.

---

## Phase 3: Monetization & Community Logic ($140)
**Status**: In Progress

### Tasks
- [ ] **Community Features**
  - [x] Like/dislike system
  - [x] Comment system (threaded)
  - [ ] Share functionality
  - [ ] Community edits (wiki-style)

- [ ] **Monetization**
  - [ ] Ad zone architecture (homepage, sidebar, between chapters)
  - [ ] Google AdSense integration capability
  - [ ] Direct advertiser banner system
  - [ ] Affiliate link engine
  - [ ] Ad placement management in admin
  - [ ] Click/impression tracking

### Notes
-

---

## Phase 4: Contribution & Review Engine ($100)
**Status**: Not Started

### Tasks
- [ ] **Content Editor**
  - [ ] Shared editor for guests and readers
  - [ ] Support for books, short stories, blogs, wiki pages
  - [ ] Draft saving

- [ ] **Submission System**
  - [ ] Submission form (public + authenticated)
  - [ ] Admin review queue
  - [ ] Accept/Decline workflow
  - [ ] Auto-publish on accept

- [ ] **Email Automation (Resend)**
  - [ ] Submission confirmation email
  - [ ] Acceptance notification email
  - [ ] Decline notification email

### Notes
-

---

## Phase 5: Testing & Launch ($110)
**Status**: Not Started

### Tasks
- [ ] QA testing
- [ ] Mobile responsiveness testing
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] SEO verification
- [ ] Vercel deployment setup
- [ ] Domain DNS configuration
- [ ] Production launch
- [ ] Admin training/handoff
- [ ] Documentation

### Notes
-

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-08-26 | Project documented | Initial setup and context creation |
| 2026-08-26 | MongoDB selected | Database choice confirmed |
| 2026-08-26 | Wiki features added | Client requested Fandom-style wiki functionality |
| 2026-08-26 | Phase 1 complete | Schema architecture finalized |
| 2026-08-26 | Design references selected | Raddito Agency (homepage), Bookshelf UI (reader) |
| 2026-08-26 | Dark/Light themes | Both themes required |
| 2026-08-26 | Development order | Homepage → Admin → Reader → User Portal |
| 2026-08-30 | Light theme accent changed | Crimson (`#8B0000`) swapped for teal (`#0F766E`) — client felt red looked off against white and asked for a WCAG check; teal also matches the "Modern Crisp" option already sketched in the theme table and doesn't collide with existing category-badge colors |
| 2026-08-30 | Admin CMS scoped as a drag-and-drop page builder | Client wants freehand, block-based page composition per content type (not fixed edit-forms), saved to DB — see "Admin CMS — Page-Builder Architecture" checklist above. Current schemas are rigid single-content-field models, so this is a data-model change, not just a UI one |
| 2026-08-30 | Phase 2 CMS scope narrowed to Wiki Pages + Books/Chapters | Client clarified: the 8 homepage tiles (Anime, Webtoons, Trading Cards, etc.) are topic categories a Wiki Page is tagged with, not 8 separate content models — the site's core is wikis, plus novels as the second pillar. Category-specific templates (Stat Block, Card Database Table, etc.) are deferred past Phase 2 |
| 2026-08-30 | Block/layout schema + Wiki Page admin builder implemented | First working slice of the CMS: `Page.blocks`, the shared `BlockRenderer`, and a full drag-and-drop admin canvas (dnd-kit) with template starters, live preview, and DB persistence — verified end-to-end against local MongoDB. See "Suggested build order" above for exactly what's done vs. still open (public-page wiring, Book/Chapter, admin auth, admin shell IA) |
| 2026-08-31 | Added `Wiki` model + page archetypes | Client pointed out a wiki has many pages of different kinds (Character/Location/Episode/Overview), not one flat template — new `Wiki` model groups a franchise's pages together, `Page.pageType` picks the archetype. Confirmed against real Fandom conventions, not just the one sample page |
| 2026-08-31 | Revision history + rollback wired into Page edits | Client described the standard wiki edit workflow (edit summary, preview, revision history, rollback) and asked for it on wiki pages specifically. Resolved the open "block-level diffing vs. full-layout snapshot" question as full-layout snapshot — `PATCH` now snapshots pre-edit state into `Revision` with an edit summary; `app/admin/wiki/[id]/history` lists and can restore any past version |
| 2026-08-31 | Admin dashboard shell built before further editors | Client: don't build isolated create-flow pages one at a time — build the dashboard/sidebar/list-views first, then plug editors into it. Required splitting the app into two root layouts (`app/(site)/` for the public site, `app/admin/` for the portal) so admin doesn't inherit the public Header/Footer |
| 2026-08-31 | Fixed a global CSS cascade bug + admin shell scroll bug | Client screenshotted the sidebar scrolling away and an oversized, cluttered look. Root cause: `app/globals.css`'s bare `h1-h6{font-size:...}` rule was unlayered, so it beat every Tailwind `text-*` size utility on heading tags app-wide (not just admin) — wrapped it in `@layer base` to fix. Sidebar/topbar weren't pinned because the shell used `min-h-screen` + `sticky` without an independent scroll container — rebuilt as `h-screen overflow-hidden` with the sidebar and `<main>` each scrolling independently |
| 2026-08-31 | Wiki Page editor redesigned as a full-width, Word-style document canvas | Client: no fixed 3-column layout, no permanent block palette — full page width to write in, blocks inserted via drag-and-drop from an "Insert" control, exactly the standard document-editor mental model users already know, since this is the public-facing wiki editor and "we cannot compromise." Rebuilt `PageBuilder`: `InsertMenu` (click-to-add or drag-to-place, using dnd-kit `useDraggable` combined with the existing `SortableContext`) replaced the static `BlockPalette` column; the properties panel is now a floating drawer that only appears when a block is selected, not a permanent column; canvas is a single centered `max-w-4xl` column. Sidebar is now collapsible (icon-only, persisted to localStorage). Also fixed two bugs surfaced by this: the infobox block was floated (`lg:float-right`) which overlapped adjacent blocks in the linear editor stack — removed, infobox is now always full-width like every other block; and dragging a block could trigger the browser's native text-selection drag ghost instead of dnd-kit's — fixed with `select-none` + `touchAction:none` on drag handles |
| 2026-08-31 | Fixed the same CSS layer bug across the whole stylesheet, not just headings | The properties drawer's `overflow-y-auto` silently did nothing — same root cause as the heading bug (`app/globals.css`'s `.card { overflow: hidden }` was unlayered, so it beat the Tailwind utility). Rather than patch each symptom, wrapped every custom class in the file (`.btn*`, `.card*`, `.section*`, `.badge-*`, `.ad-zone*`, `.book-cover*`, `.prose-wiki*`, base element defaults) into proper `@layer base` / `@layer components` blocks, matching Tailwind's own convention, so any Tailwind utility can reliably override any custom class anywhere in the app going forward |
| 2026-08-31 | Editor toolbar rebuilt to match the MediaWiki/Wikipedia editing UI directly | Client sent real Wikipedia editor screenshots (toolbar ribbon + rendered infobox-in-sidebar article layout) as the explicit target, not a general "Word-like" gesture. Rebuilt the toolbar as one ribbon strip (Undo/Redo, Insert, Edit/Preview, Save) instead of two stacked rows, added a real undo/redo history stack (structural edits push immediately, text edits debounce so undo steps through typing sessions, not per keystroke), and moved the title to a heading-styled field below the toolbar (matching where Wikipedia shows the page title). Infobox and Table of Contents blocks now render in a dedicated right-hand sidebar column (`BlockListRenderer` splits blocks into main/sidebar groups by type) instead of inline in the block stack, reproducing Wikipedia's actual article layout — the editor canvas itself stays a flat, simple block list (each sidebar-bound block is tagged "→ sidebar on page") rather than a second live-synced column, to keep the drag-and-drop implementation reliable rather than adding a harder-to-verify freeform positioning system |
| 2026-08-31 | Clarified Wikipedia's editor is NOT a block editor, and added a second (Text) editor as a per-admin choice | Told the client directly: MediaWiki's editor is one continuous flowing document (headings are a paragraph style, not draggable objects; the infobox is a template auto-positioned by CSS, not manually dragged) — genuinely different from the block editor already built. Client's call: ship both, let each admin account pick their default via a new Settings page, and guarantee both produce the same rendered page and are lossless to convert between. Implementation: `User.preferences.editorMode` (`'block'\|'text'`), `/admin/settings` + `/api/admin/settings`. New `TextEditor.tsx` uses TipTap (a real rich-text engine — hand-rolling this via `document.execCommand` the way the block editor's small per-block toolbar does was judged too unreliable for the primary authoring surface). `src/lib/blocks/textDocument.ts` converts both directions: `blocksToDocument()` concatenates heading/richText/quote blocks into one flowing HTML string TipTap loads (infobox/TOC become side-panel state, everything else — image/gallery/video/cardGrid/etc. — is carried through untouched, not authored inline); `documentToBlocks()` splits the edited HTML back into heading/richText blocks at heading boundaries and reassembles the full block array. Both editors call the same `onSave` with the same `Page.blocks` shape and render through the same `BlockRenderer`, so "same wiki style" holds by construction. Known simplification: a `quote` block collapses into a `<blockquote>` inside a `richText` block after a trip through the Text editor — same rendered look, but it stops being its own discrete block type. Verified: settings persist via the API, a page containing every block type (infobox/TOC/heading/richText/quote/gallery) saves and both editor routes load it without error — the in-browser TipTap conversion itself still needs the client to actually test it, no browser tool available this session |
| 2026-09-02 | Fixed duplicate Infobox/TOC bug, switched sidebar to real icons | Client screenshotted two "Contents" boxes stacked on one page. Root cause: nothing stopped `InsertMenu`/drag-insert from adding a second infobox or tableOfContents block, and only `BlockListRenderer`'s Preview path deduplicated (via `.find()`) — the edit canvas just rendered whatever was in the array, duplicates included. Fixed at the source: `PageBuilder.addBlock()` now refuses to add a second singleton-type block (covers both click-to-add and drag-to-insert, since both route through it), and `InsertMenu` greys out Infobox/TOC once one already exists. Also replaced the sidebar's emoji icons with `lucide-react` (client: "use icons not emojis... dashboard ui is useless and not attractive") and moved the collapse toggle into the sidebar's header row next to the logo instead of a text link at the bottom; gave the dashboard home page icon-badged stat cards |
| 2026-09-02 | Text editor: font size, inline image/video, image uploader, TOC position fix | Client asks, all implemented: (1) Font size dropdown — uses TipTap v3's own official `FontSize` extension (`@tiptap/extension-text-style`'s named export; my first attempt imported it as a default export and broke the build, client caught it via the Next.js error overlay — fixed by switching to the named import) rather than hand-rolling one. (2) Images and video are now genuinely inline in the flowing document, not sidelined to the "other blocks" list — `@tiptap/extension-image` for images, a small custom `VideoEmbed` TipTap node (`src/lib/tiptap/VideoEmbed.ts`) for video, since TipTap has no official video extension. `textDocument.ts`'s conversion functions updated both directions accordingly. (3) Image uploader: new `Media`-backed upload endpoint (`app/api/admin/media`, writes to `public/uploads` — TODO-marked as dev-only, Vercel's serverless functions have no writable persistent disk, production needs real object storage) plus a shared `ImagePicker` modal (Upload tab or URL tab, both always offered) used by the Text editor's Insert Image button. (4) `sanitize.ts` split into `sanitizeHtml` (block editor's small toolbar output) and a wider `sanitizeFlowHtml` (allows img/video-embed/heading/font-size-span — TipTap's actual output) so the new inline content survives round-tripping through the sanitizer instead of being silently stripped. (5) Table of Contents was incorrectly grouped with the infobox into the right sidebar column — moved to the main column and pinned to always render first (right after the page heading), regardless of the block's position in the array, matching real Wikipedia layout and the client's explicit correction |
| 2026-09-02 | Public wiki page wired to real data + full SEO (sitemap, robots, metadata, JSON-LD) | Client asked how dynamic wiki pages get indexed/ranked by Google. Answer required actually doing the prerequisite this session had been deferring: `app/(site)/wiki/[wikiSlug]/[pageSlug]/page.tsx` was still a client component with hardcoded mock data — an empty shell needing JS to populate is a weak crawl signal even though Google can execute JS. Rewrote it as a Server Component querying `Wiki`/`Page` directly (same pattern the admin dashboard pages already used), added `generateMetadata` (title/description/canonical/OG/Twitter card, `og:image` from `Page.coverImage`), JSON-LD `Article` structured data, `app/sitemap.ts` (all published pages, DB-driven) and `app/robots.ts` (allow `/wiki`, disallow `/admin` and `/api`). Public pages only render when `status: 'published'` (draft → 404) — which surfaced a real gap: there was no way to publish a page at all. Added a Publish/Draft toggle to the edit route (`PATCH .../status`), plus a "View live" link once published. Verified full cycle end-to-end: draft 404s, publish flips status, live page returns correct `<title>`/canonical/`og:image`/JSON-LD, sitemap.xml lists it. `NEXT_PUBLIC_SITE_URL` env var needed for production (falls back to localhost) |
| 2026-09-02 | Wiki + Page cover images, admin lists converted from tables to card grids | Client: wiki creation should ask for a cover image (used on the homepage card and as the wiki's own "cover page" hero), and admin should browse wikis/pages as cards with cover thumbnails, not tables — also asked to confirm Character-type pages have their own page/cover, which they already did structurally but the field was never exposed in either editor. Added a cover-image control (thumbnail + the shared `ImagePicker`) to `WikiPicker`'s creation form and to both `PageBuilder` and `TextEditor` near the title; threads through `PageBuilderSaveData` and both `/api/admin/wikis` and `/api/admin/pages*` routes. `Page.coverImage` is also what the new SEO metadata uses for `og:image`, so this closes that gap too. `/admin/wikis` and `/admin/pages` rebuilt as responsive card grids with cover thumbnails instead of tables. Still open: the wiki's own hub page (`app/(site)/wiki/[wikiSlug]/page.tsx`) is still the old mock version — wiring it to show a wiki's real Overview-type page as its "cover page" plus a real page listing is the natural next step, not done this session |
| 2026-09-02 | Fixed stale duplicate TOC data on one live page; wired the wiki hub/"cover" page to real data with a defined trending formula | Client: one specific page still had 2 Contents boxes even after the dedup guard — correctly diagnosed as pre-existing bad data the guard can't retroactively fix, not a new bug; removed the duplicate block directly in Mongo. Also asked "how is this cover page created for any wiki" (pointing at the still-mock wiki hub screenshot) — built it for real: `app/(site)/wiki/[wikiSlug]/page.tsx` now a Server Component computing everything live from `Wiki`/`Page`/`Revision` (hero from `Wiki.coverImage`, page/view stats, category breakdown via a tags aggregation, recent activity from real `Revision` docs) instead of a hardcoded mock object — the wiki's cover page needs no separate creation step, it exists automatically once the Wiki does. Client then asked to define "trending": implemented as a weighted score (`viewCount + searchCount * 3`, `src/lib/db/trending.ts`) — a new `Page.searchCount` field increments once per page per search query it surfaces in (search hits are a stronger intent signal than passive views), reused by the hub page's "🔥 Trending Pages" section. Also added a working `Random page` link (`/wiki/[wikiSlug]/random`, Mongo `$sample`) and an in-page search results view (same route, `?q=`). Documented limitation: trending is an all-time score, not recency-weighted — true "trending this week" needs a time-series view log (a separate collection), not built yet. Verified end-to-end: created two pages, drove one's view count up and the other's search count up, confirmed the search-weighted page (score 9) ranked above the higher-raw-views page (score 5) exactly as the formula predicts |

---

## Theme Selection

**Pending client decision**

Options:
1. Classic Editorial (Light) - `#FAFAFA` / `#2C3E50` / `#8B0000`
2. Modern Crisp (Light) - `#FFFFFF` / `#333333` / `#008080`
3. Midnight Library (Dark) - `#121212` / `#E0E0E0` / `#D4AF37`
4. Twilight Reader (Dark) - `#1A202C` / `#F7FAFC` / `#6B46C1`
5. Astral Loom (Dark) - `#161922` / `#F5F5F5` / `#FF7F0A`

---

## Technical Decisions

| Component | Choice | Status |
|-----------|--------|--------|
| Framework | Next.js | Confirmed |
| Database | MongoDB | Confirmed |
| ODM | Mongoose | Confirmed |
| Email | Resend | Confirmed |
| Hosting | Vercel | Confirmed |
| Auth | Custom credentials auth: bcryptjs + jose JWT in an httpOnly cookie (not NextAuth — no OAuth providers needed) | In progress, see `docs/superpowers/specs/2026-09-06-auth-and-contribution-workflow-design.md` |

---

## Backlog (post Phase 2 — "standard wiki platform" features)

Client asked to brainstorm further reader/admin features; decided
2026-09-06 to backlog these rather than fold into the in-progress
auth/contribution/public-data/site-pages build, so that build finishes
end-to-end instead of scope growing indefinitely:

- [ ] **Deploy prerequisite (not optional):** before this branch's `Wiki.status` filters go live in production, run `db.wikis.updateMany({ status: { $exists: false } }, { $set: { status: 'approved' } })` against the production database — Mongoose defaults only apply at document creation, so wikis created before the field existed have no `status` and would be silently hidden forever by the new `status: 'approved'` filters (homepage, wiki hub, public page routes, sitemap). Already run against the local dev DB (4 wikis backfilled); there is no formal migration system in this repo, so this is a manual step.
- [ ] **Deploy prerequisite (not optional):** same hazard, second field — before this branch's `Revision.status: 'applied'` filters go live in production (added to keep unreviewed contributor edit summaries off the public homepage and wiki hub pages), run `db.revisions.updateMany({ status: { $exists: false } }, { $set: { status: 'applied' } })` against the production database. Revisions created before the field existed have no `status`, and the new filter is fail-closed (hides anything not explicitly `'applied'`), so without this they'd be silently and permanently dropped from the public activity feeds. Already run against the local dev DB (17 revisions backfilled, verified all pre-dated this branch's review workflow and were admin-authored before backfilling).
- [ ] Watchlist — follow a wiki/page, surfaced in the user dashboard when it changes
- [ ] Talk/discussion pages per wiki page
- [ ] Public user profile page (contributions, join date)
- [ ] Notifications (your edit was approved/declined)
- [ ] Page history diff view (side-by-side change view, not just full-snapshot rollback)
- [ ] Admin: user management (promote/demote roles, ban/deactivate)
- [ ] Admin: page protection (lock a page from non-trusted edits)
- [ ] Admin: bulk actions on the review queue
- [ ] Admin: basic analytics (top pages, active contributors)
- [ ] Admin: category/tag manager UI

---

## Blockers / Issues

None currently.

---

## Meeting Notes

*Add meeting notes and client feedback here*
