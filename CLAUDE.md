@AGENTS.md
@README.md
@PROGRESS.md

# Marc's Wiki Platform

## Project Context
Wiki-style content platform (similar to Fandom) with serialized fiction publishing. Built for Marc by Orvynexia.

## Key Files
- `README.md` - Full project overview, tech stack, features
- `PROGRESS.md` - Development phases, task tracking, decisions log
- `src/lib/db/models/` - MongoDB schemas (Mongoose)

## Core Features
- Wiki-style pages with revision history
- Category-based organization
- Serialized novels (books + chapters)
- Blog posts and short stories
- Community contributions with admin review
- Strategic ad placements
- Full admin CMS

## Development Guidelines
- Follow Agile Scrum methodology
- Update PROGRESS.md after completing tasks
- Monetization is a core design principle (not an afterthought)
- Admin panel must enable full self-serve content management
- All content types support revision tracking
- Database schema designed for multi-domain scalability

## Tech Stack
- Next.js (frontend + backend)
- MongoDB + Mongoose (database)
- Resend (email automation)
- Vercel (hosting)

## Database Models
User, Category, Page, Revision, Book, Chapter, BlogPost, ShortStory, Comment, Reaction, AdPlacement, AffiliateLink, Media, Submission, ReadingProgress, SiteConfig
