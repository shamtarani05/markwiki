# MarcWiki — UI Overhaul: Beautiful & Engaging Design

## Background

After a thorough audit of the entire MarcWiki codebase, the current UI is **functional but visually generic**. The site has solid architecture (Next.js 16, MongoDB, Tailwind v4, full auth, block-based wiki editor, revision history) but the visual layer needs a major uplift to match the ambition of the platform. Here's what exists vs. what needs to happen:

### Current State Summary

| Area | Status | Quality |
|------|--------|---------|
| **Phase 1 — Schema/Architecture** | ✅ Complete | Solid — 18 Mongoose models, block system, revision history |
| **Auth System** | ✅ Complete | JWT + bcrypt, role-based middleware, login/register/account |
| **Admin Dashboard** | ✅ Working | Functional but bare — stat strip + recent-pages list |
| **Wiki Page Editor** | ✅ Working | Block editor (dnd-kit) + Text editor (TipTap), both routes functional |
| **Public Wiki Pages** | ✅ Working | Server-rendered, SEO (sitemap, robots, JSON-LD, OG) |
| **Homepage** | ⚠️ Functional but generic | 10 sections, real DB data, but looks like a template — needs wow factor |
| **Wiki Hub Pages** | ✅ Working | Real data, trending, search, random page |
| **Reader Portal** | ❌ Not started | No book/chapter reader, no bookshelf, no reading progress UI |
| **User Portal** | ❌ Deferred | User content creation flow moved to future work |
| **Monetization** | ❌ Placeholder | Ad zones render static "Advertisement" text |
| **Community Features** | ❌ Not started | No comments, no reactions, no sharing |

### Key UI Problems

1. **Hero section** — uses Unsplash stock photos (not thematic), hardcoded "500+ Wikis / 50K+ Pages" stats that are fake
2. **Category cards** — gradient overlay generates `from-accent` which produces an odd monochrome tint
3. **No visual identity** — the "Midnight Library" dark theme is serviceable but doesn't feel premium or memorable
4. **No micro-animations** — scroll-triggered reveals, parallax, hover transitions beyond basic transform
5. **Typography** — Geist Sans is clean but personality-free for a fan wiki platform
6. **Component repetition** — many sections use the same card + border pattern without visual variety
7. **Empty states** — when DB has no data, sections either show nothing or a plain text message
8. **Admin UI** — functional-tier design, no personality, sidebar uses basic text links

---

## User Review Required

> [!IMPORTANT]
> **Stitch MCP Usage**: I'll use Stitch to generate high-fidelity screen designs for each major page (homepage, wiki hub, wiki page, admin dashboard) that we can reference during implementation. This gives us pixel-perfect design targets before writing code. The generated designs produce React/HTML code that we'll adapt to our existing component structure — not drop in wholesale.

> [!IMPORTANT]
> **Theme Decision Still Pending**: The PROGRESS.md lists 5 theme options but none were selected. The current CSS uses "Midnight Library" (dark) as default. For the UI overhaul, I recommend committing to a theme. My recommendation is **Midnight Library (dark)** with gold accent `#D4AF37` as the primary theme, since a dark premium theme with gold accents signals luxury/quality for a content platform.

---

## Open Questions

> [!IMPORTANT]
> **1. Which pages to prioritize for the UI redesign?**
> I recommend this order: Homepage → Wiki Hub → Public Wiki Page → Admin Dashboard → Login/Register. Should I proceed with all of them, or focus on a subset first?

> [!IMPORTANT]
> **2. Stitch design system colors**
> Should we keep the current Midnight Library palette (`#121212` / `#D4AF37` gold accent) or do you want to explore a different direction? Stitch can generate variant designs for comparison.

> [!IMPORTANT]
> **3. Scope of "beautiful & engaging"**
> This can range from a CSS-only polish pass (faster, keeps all existing components) to a full component rewrite with new animations, layout overhauls, and generated assets. Which level do you want?

---

## Proposed Changes

### Phase A: Design System in Stitch

#### [NEW] Stitch Project + Design System
- Create a Stitch project "MarcWiki"
- Create a design system with:
  - **Custom color**: `#D4AF37` (gold accent)
  - **Color mode**: DARK
  - **Color variant**: VIBRANT (for rich, saturated derivatives)
  - **Headline font**: SYNE (bold, geometric, great for fan wiki branding)
  - **Body font**: INTER (clean, highly readable)
  - **Roundness**: ROUND_TWELVE (modern, soft)
- Generate screen designs for: Homepage, Wiki Hub, Wiki Page, Admin Dashboard

---

### Phase B: Global Design Overhaul

#### [MODIFY] [globals.css](file:///d:/FreeLancing_Projects/markwiki/app/globals.css)
- Upgrade CSS custom properties with richer color palette
- Add glassmorphism utility classes (`.glass`, `.glass-dark`)
- Add gradient mesh background utilities
- Add scroll-triggered animation keyframes (`fadeInUp`, `scaleIn`, `slideInLeft`, `slideInRight`)
- Add text gradient utilities
- Add glow/neon accent effects for dark theme
- Improve card variants (`.card-glass`, `.card-featured`, `.card-glow`)

#### [MODIFY] [layout.tsx](file:///d:/FreeLancing_Projects/markwiki/app/(site)/layout.tsx)
- Upgrade typography from Geist to a more distinctive pairing (Syne + Inter or similar)
- Add a subtle animated gradient mesh background layer

---

### Phase C: Homepage Redesign

#### [MODIFY] [HeroSection.tsx](file:///d:/FreeLancing_Projects/markwiki/src/components/home/HeroSection.tsx)
- Replace static stock images with generated anime/gaming-themed hero art
- Add animated gradient background with floating particles
- Replace hardcoded fake stats with real DB-driven numbers (wikis count, pages count, contributor count)
- Add a scroll-triggered typing animation for the headline
- Improve search bar with glassmorphism effect + real suggestions dropdown
- Add animated wiki card stack on the right side with real wiki data

#### [MODIFY] [CategorySection.tsx](file:///d:/FreeLancing_Projects/markwiki/src/components/home/CategorySection.tsx)
- Replace generic gradient overlay with per-category themed gradients
- Add hover-activated glassmorphism + icon animation
- Generate category-specific background art via `generate_image`
- Add scroll-triggered stagger animation for cards

#### [MODIFY] [FeaturedWikisSection.tsx](file:///d:/FreeLancing_Projects/markwiki/src/components/home/FeaturedWikisSection.tsx)
- Redesign wiki cards with cover art prominence, glassmorphism info overlay
- Add parallax scroll effect to the carousel
- Improve pagination dots with animated bar indicator

#### [MODIFY] [TrendingPagesSection.tsx](file:///d:/FreeLancing_Projects/markwiki/src/components/home/TrendingPagesSection.tsx)
- Add animated fire icon for trending
- Add rank numbers with gradient text
- Add real-time view count badges

#### [MODIFY] [CommunitySection.tsx](file:///d:/FreeLancing_Projects/markwiki/src/components/home/CommunitySection.tsx)
- Redesign with a bento-grid layout instead of standard 2-column
- Add user avatar stack for contributors
- Add animated activity pulse indicators

#### [MODIFY] [RecentActivitySection.tsx](file:///d:/FreeLancing_Projects/markwiki/src/components/home/RecentActivitySection.tsx)
- Add a live-feed style timeline with animated entry transitions
- Add contributor leaderboard with rank badges and avatar glow effects

#### [MODIFY] [PublishCTASection.tsx](file:///d:/FreeLancing_Projects/markwiki/src/components/home/#### [MODIFY] PublishCTASection.tsx (Deferred to Future Work)
- *Note: User content contribution flows are deferred to future updates.*
- Remove or modify the "Publish Your Book" CTA to reflect that content contribution is not currently available for non-admins.

#### [MODIFY] [NewsletterSection.tsx](file:///d:/FreeLancing_Projects/markwiki/src/components/home/NewsletterSection.tsx)
- Glassmorphism card with animated input focus states
- Add success animation on submit

---

### Phase D: Header & Footer Polish

#### [MODIFY] [Header.tsx](file:///d:/FreeLancing_Projects/markwiki/src/components/layout/Header.tsx)
- Add logo animation on hover
- Improve mobile menu with slide-in panel + backdrop blur
- Add command palette search (Ctrl+K) with glassmorphism modal
- Add active nav link indicator with animated underline

#### [MODIFY] [Footer.tsx](file:///d:/FreeLancing_Projects/markwiki/src/components/layout/Footer.tsx)
- Add subtle gradient border separator
- Improve social icons with hover glow effects
- Add a "back to top" floating button

---

### Phase E: Wiki Pages Polish

#### [MODIFY] [WikiPageLayout.tsx](file:///d:/FreeLancing_Projects/markwiki/src/components/wiki/WikiPageLayout.tsx)
- Improve infobox card with glassmorphism
- Add reading progress indicator bar at top
- Improve heading anchors with hover-reveal links
- Add table of contents with scroll-spy highlighting

---

---

### Phase F: Book & Chapter Admin CMS

**Goal:** Create the admin tools needed to create and manage Books (novels) and Chapters, as specified in `PROGRESS.md`.

#### [NEW] `src/components/admin/books/BookEditor.tsx`
- A new form for managing `Book` metadata (cover, title, synopsis, author, tags).
- Include an orderable drag-and-drop list of associated chapters.

#### [NEW] `src/components/admin/books/ChapterEditor.tsx`
- A distraction-free WYSIWYG editor for writing chapter prose.
- Option to select the parent book and chapter order.

#### [NEW] `app/admin/books/page.tsx` & `app/admin/books/new/page.tsx`
- Admin table/grid to list books.
- The creation/edit page for a book.

#### [NEW] API Routes (`app/api/admin/books/...`)
- Standard CRUD endpoints for `Book` and `Chapter` models.

---

### Phase G: Reader Portal (Books & Novels)

**Goal:** Build the public-facing pages for reading novels/books and tracking progress.

#### [NEW] `app/(site)/book/[bookSlug]/page.tsx`
- Book detail landing page with animated cover, synopsis, and list of chapters.
- "Start Reading" / "Continue Reading" CTA button based on progress.

#### [NEW] `app/(site)/book/[bookSlug]/[chapterSlug]/page.tsx`
- The chapter reading experience.
- Distraction-free, centered prose layout.
- Previous/Next chapter navigation.
- Progress tracking integration (`ReadingProgress` updates as user scrolls).

#### [NEW] `app/(site)/bookshelf/page.tsx`
- A user's personal bookshelf showing saved books and their reading progress (%).

---

### Future Work

- **User Portal / Contribution Flow**: Deferred. Regular users/readers will **NOT** be able to create files, books, or wiki pages for now.
- **Monetization & Community Features**: Comments, reactions, and dynamic ad placement.

## Verification Plan

### Visual Verification
- Open each redesigned page in the browser and capture screenshots
- Compare against Stitch-generated design targets
- Test dark and light theme switches
- Test responsive breakpoints (mobile, tablet, desktop)

### Functional Verification
- Verify all existing functionality still works (links, search, auth, wiki editing)
- Verify Admin can create a Book and add Chapters.
- Verify Readers can view the Book page, read Chapters, and have their progress tracked.
- Run `npm run build` to ensure no TypeScript/build errors
- Test the dev server with `npm run dev`
