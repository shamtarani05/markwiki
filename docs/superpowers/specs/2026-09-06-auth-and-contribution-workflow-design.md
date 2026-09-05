# Auth, Contribution-Aware Wiki Editor, Live Public Site, Site Pages

Date: 2026-09-06
Status: Approved for planning

## Context

Phase 1 (schema) and the first slice of Phase 2 (Wiki Page block editor,
admin dashboard shell, revision history, SEO-wired public wiki pages) are
done — see `PROGRESS.md`. Everything else in Phase 2 (Book/Chapter CMS,
Blog/Story editors), the User Portal, and Community features (Phase 3) are
not started. Critically, **no authentication exists at all**: `User.password`
is defined but nothing hashes, checks, or issues a session against it; every
admin write currently runs through a placeholder "system author"
(`src/lib/db/getSystemAuthor.ts`).

The client set this priority order for today's work, ahead of the remaining
Phase 2 items (Book/Chapter, Blog, Short Story):

1. Auth
2. Wiki editor fully available to both admin and regular users, with an
   approval workflow gating anything a non-admin creates or edits
3. Public site wired to real data (no more mock arrays)
4. A page editor for the homepage/About/other static pages

This spec covers all four as one sequential build (each phase depends on
the previous), implemented as four phases in the implementation plan.

## Phase A — Auth

**Approach:** custom credentials auth (bcrypt + JWT in an httpOnly cookie),
not NextAuth. The app only needs email/password login, session, and role
checks — no OAuth providers, no adapter complexity to carry.

- `src/lib/auth/password.ts` — `hashPassword` / `verifyPassword` (bcrypt).
- `src/lib/auth/session.ts` — sign/verify a JWT (`{ sub: userId, role }`,
  7-day expiry) using an `AUTH_SECRET` env var; `getSessionUser()` reads and
  verifies the `session` httpOnly cookie server-side (route handlers, server
  components, `middleware.ts`).
- API routes: `POST /api/auth/register` (creates a `reader`), `POST
  /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`.
- `middleware.ts` — redirects unauthenticated requests to `/admin/**` to
  `/login`; redirects requests to `/admin/**` from a non-admin/editor role to
  a "not authorized" page.
- Public pages: `/login`, `/signup`.
- Replace every call site of `getSystemAuthor()` with the real session
  user; delete the placeholder once no callers remain.
- Role gate used throughout Phase B: `admin` and `editor` are "trusted"
  (direct publish); `contributor` and `reader` go through review.

**Testing:** register → login → cookie set → `/api/auth/me` returns the
user; hitting `/admin` unauthenticated redirects to `/login`; hitting
`/admin` as a `reader` is denied; existing admin page-save routes keep
working end-to-end with a real logged-in admin instead of the placeholder.

## Phase B — Contribution-aware wiki editor

**Wiki creation flow changes.** Today `WikiPicker` creates a `Wiki` and
sends the user straight to the page/template picker. New flow:

1. Fill wiki metadata (name, description, category, cover image) — same
   form as today.
2. On create, the API auto-creates a **cover page**: a normal `Page`
   document (`pageType: 'cover'`, `wiki: <this wiki>`, fixed `slug: '_cover'`)
   pre-filled with a template: hero (from name/description/coverImage),
   plus three new dynamic block types (below), plus a card-grid block
   linking into the wiki's other pages. `Wiki` gets a new `coverPage: ObjectId
   ref Page` field pointing at it.
3. The user is dropped straight into `PageBuilder`/`TextEditor` on that
   cover page to customize it (swap blocks, edit copy) — it's a normal page,
   fully editable, not a special-cased template.
4. From there they proceed to add other pages into the wiki as today
   (Character/Location/Episode/Overview archetypes via `TemplatePicker`).

**New dynamic block types** (`src/lib/blocks/types.ts`, rendered in
`BlockRenderer.tsx`, following the existing `adSlot` pattern of a block that
queries live data at render time, scoped to `block.props.wikiId` /
the page's own `wiki` field):
- `wikiStats` — page count, contributor count, total views for the wiki.
- `trendingPages` — top N pages by the existing trending formula
  (`src/lib/db/trending.ts`), scoped to this wiki.
- `recentActivity` — latest `Revision` docs for pages in this wiki.

These replace the bespoke hand-computed JSX currently in
`app/(site)/wiki/[wikiSlug]/page.tsx`; that route becomes: fetch `Wiki` →
fetch its `coverPage` → render through `BlockRenderer`, matching how every
other page already renders.

**Approval workflow**, gated by the Phase A role check. Every new wiki —
admin's own included — starts as a private **draft** so its creator can
build out the cover page and a few pages before anyone else sees it. From
there:
- admin/editor: an explicit **Publish** action on their own wiki flips
  `draft → approved` directly (they're trusted, no queue).
- contributor/reader: an explicit **Submit for review** action flips
  `draft → pending`; admin then approves (`pending → approved`) or declines
  (`pending → draft`, with a review note) from the review queue.

A wiki's owner (its `createdBy`) can always view and edit their own
`draft`/`pending` wiki and preview it with the same admin-only preview
renderer described below (so admin previews their own work-in-progress
wiki the same way they preview a contributor's pending submission — one
preview code path, two entry points).

| Actor | New wiki | New page | Edit to existing page |
|---|---|---|---|
| admin / editor | `Wiki.status: 'draft'`, then `'approved'` on Publish | `Page.status: 'published'` (or `draft`, admin's own choice) immediately | Applied immediately, `Revision.status: 'applied'` (today's behavior) |
| contributor / reader | `Wiki.status: 'draft'`, then `'pending'` on Submit for review | `Page.status: 'pending'` | Live page untouched; a new `Revision.status: 'pending'` row stores the proposed `title`+`blocks` |

Schema changes:
- `Wiki.status: 'draft' | 'pending' | 'approved'` (default `'draft'` for
  everyone on creation). Public wiki queries filter to `status: 'approved'`.
- `Page.status` gains `'pending'` alongside `draft | published | archived`.
  Public page queries already filter to `'published'` — unaffected.
- `Revision.status: 'pending' | 'applied' | 'rejected'`, default `'applied'`
  (keeps every existing revision and the rollback flow working unchanged).

**Public edit entry point:** an "Edit" button on
`app/(site)/wiki/[wikiSlug]/[pageSlug]/page.tsx`, visible to any logged-in
user, opening the same editor pre-filled with the live page. A non-admin's
save hits a new endpoint that writes a pending `Revision` instead of
`PATCH`-ing the page directly.

**Admin review queue** — `app/admin/review`: one list merging pending
`Wiki`s, pending `Page`s, and pending `Revision`s (newest first), each row
showing who submitted it and when. Approve/Decline actions:
- Approve wiki → `status: 'approved'`.
- Approve page → `status: 'published'` (or `'draft'`, admin's choice).
- Approve revision → apply its `title`/`blocks` to the live `Page` (same
  code path the existing rollback endpoint uses to restore a revision),
  mark `status: 'applied'`.
- Decline wiki/page → back to `status: 'draft'` plus a `reviewNote`, so the
  contributor can revise and resubmit rather than losing the work. Decline
  revision → `status: 'rejected'` (the live page is untouched either way).
- **Preview before deciding:** each row links to an admin-only preview —
  for a pending wiki, its cover page plus its page list rendered through
  the same `BlockRenderer` the public site uses but fetched by ID and
  ignoring the status gate (`app/admin/review/wiki/[id]` and
  `.../page/[id]`), with a "Pending — not yet public" banner. This means
  the public rendering path needs to be a shared function/component taking
  a already-fetched document, called by both the status-gated public route
  and the ungated admin preview route — not duplicated JSX.

**User-side — `/account` dashboard:** a proper dashboard, not a bare list —
two sections, each shown as an image-led card grid (cover images pulled
from `Wiki.coverImage`/`Page.coverImage`, matching the visual language
already used on the homepage and admin card grids):
- **Continue Reading** — the user's most recently viewed wiki pages.
  Backed by the existing (currently unused) `ReadingProgress` model:
  every published-page view by a logged-in user upserts a
  `{ user, contentType: 'page', contentId }` record with `lastReadAt: now()`
  (no scroll-percent tracking — YAGNI for this pass, the model already
  supports it later without a schema change). The dashboard's Continue
  Reading row queries the user's 6 most recent `ReadingProgress` docs,
  populates the referenced `Page`+`Wiki`, and links back in.
- **My Contributions** — the user's own submitted wikis/pages/revisions
  with their status (draft/pending/approved/rejected), linking into the
  preview/edit flow above.

**Testing:** as admin, create a wiki (lands in `draft`), preview it,
Publish it (`approved`), confirm it's now live end-to-end (same overall
experience as today, just with a real logged-in author and an explicit
preview+publish step instead of instant-live). As a `reader` account,
create a wiki → confirm it does NOT appear in public listings → approve it
as admin → confirm it now does. As a `reader`, edit an existing published
page → confirm the live page is unchanged → approve the pending revision →
confirm the live page now shows the change and the page's revision history
records it.

## Phase C — Public site wired to real data

`app/(site)/page.tsx` becomes a Server Component. Each section
(`HeroSection` excluded — it's just a search box) gets its mock-data
`interface` moved to accept props instead of holding a hardcoded array;
`page.tsx` runs the necessary queries (reusing `trending.ts` and the
patterns already used in the wiki hub page) and passes real props in. No
visual/interaction changes — this is a data-source swap, not a redesign,
though any section touched gets a visual polish pass per the
`frontend-design` skill since "make it look unique" is a standing
requirement across this whole effort.

Sections in scope: `CategorySection` (real `Category` docs + counts),
`FeaturedWikisSection` (approved, `isFeatured` wikis), `TrendingPagesSection`
(reuse trending formula across all wikis), `CommunitySection` /
`RecentActivitySection` (real `Revision` feed). Empty states (fresh DB, or
before Phase B produces approved content) render a clean "nothing yet"
state rather than blank space.

**Testing:** with at least one approved wiki + published page in the DB
(created via Phase B's flow), the homepage shows it in the relevant
section(s) with no mock data remaining; with zero approved content, empty
states render without errors.

## Phase D — Site Pages editor (Home / About / etc.)

A new page type for standalone site pages that don't belong to a Wiki:
`Page.wiki` becomes optional (currently required — relax the schema
constraint) OR a lighter parallel model. Given how much `PageBuilder`/
`TextEditor`/`BlockRenderer` machinery already exists for `Page`, reuse it:
add `pageType: 'site'` and make `wiki` optional when `pageType === 'site'`,
addressed by a fixed `siteSlug` (`'about'`, `'contact'`, ...) instead of the
wiki-scoped slug uniqueness.

- `app/admin/pages/site` — list of site pages (seed `about` on first admin
  visit, same idempotent-seed pattern as `Category`).
- Editing reuses `PageBuilder`/`TextEditor` unchanged (they already operate
  on a generic `Page`); only the save endpoint and the picker step differ
  (no wiki/template-archetype picker, just a page-type list).
- Public routes: `app/(site)/about/page.tsx` etc., rendered through
  `BlockRenderer` like any other page.
- Homepage stays code-driven for its live-data sections (Phase C); only its
  hero copy/CTA text becomes optionally block-authored if time allows — not
  a hard requirement of this phase.

**Testing:** admin creates/edits an About page via the block editor, saves,
and `/about` renders it live.

## Phase E — Admin portal visual design pass

Client feedback mid-session: the admin portal reads as visually generic
("vague and dirty") — functional but with no real design applied (flat
uniform cards, a bare topbar, minimal sidebar differentiation). This is a
visual-only pass (no IA changes) over the existing admin shell
(`AdminSidebar`, `AdminTopBar`), the dashboard, and the wikis/pages list
views, plus the new Review Queue and Site Pages screens Phases B/D add —
done via the `frontend-design` skill rather than ad hoc. Also fixes a bug
surfaced while scoping this: `app/admin/layout.tsx` hardcodes
`data-theme="dark"`, so the admin portal currently never follows the
light/dark theme switching the public site already has.

## Out of scope for this spec

Book/Chapter CMS, Blog Post/Short Story editors, the full Reader Portal
(bookshelf/reading progress), and community features beyond the
contribution-review flow above (comments, reactions, share) are still
queued behind this work per the client's stated priority order and are not
designed here.
