# Marc's Wiki Platform

A custom wiki-style content platform with serialized fiction publishing, built for Marc by Orvynexia.

## Project Overview

A content-rich wiki-style platform (similar in structure to Fandom) combined with serialized fiction publishing. Features comprehensive wiki capabilities, community contributions, and a monetization-first design philosophy.

### Key Features

- **Wiki-Style Functionality**: Category-based organization, revision history, community edits
- **Mixed Content Feed**: Homepage surfaces books, blog posts, wiki articles, and short stories
- **Chapter-by-Chapter Reading**: Distraction-free UI with progress tracking
- **Contribution System**: Community contributions with admin review workflow
- **Full Admin CMS**: Self-serve content management without developer involvement
- **Monetization-First Architecture**: Strategic ad zones, affiliate links, multi-channel support

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend & Backend | Next.js |
| Database | MongoDB |
| Email Automation | Resend |
| Hosting | Vercel (free tier initially) |
| Monetization | Google AdSense, direct advertisers, affiliate tracking |

## User Journeys

### Reader Journey
1. **Discovery** - Mixed feed homepage with covers/previews
2. **Reading** - Chapter-by-chapter consumption with seamless ad integration
3. **Engagement** - Like, dislike, comment, share; auto-saved reading progress
4. **Contributing** - Submit content via built-in editor

### Admin Journey
1. **Direct Publishing** - Create/publish books, blogs, short stories without approval
2. **Review Submissions** - Single queue for all contributed content (Accept/Decline)
3. **Site Management** - Full control over monetization, layout, SEO, navigation

### Contributor Journey
1. **Pitch** - Submit via reader account or public form
2. **Notification** - Automated email on submission and decision
3. **Publication** - Accepted pieces go live on Guest Contribution page

## Color Themes

### Light Themes

| Theme | Background | Primary Text | Accent |
|-------|------------|--------------|--------|
| Classic Editorial | `#FAFAFA` | `#2C3E50` | `#8B0000` (Deep Crimson) |
| Modern Crisp | `#FFFFFF` | `#333333` | `#008080` (Muted Teal) |

### Dark Themes

| Theme | Background | Primary Text | Accent |
|-------|------------|--------------|--------|
| Midnight Library | `#121212` | `#E0E0E0` | `#D4AF37` (Muted Gold) |
| Twilight Reader | `#1A202C` | `#F7FAFC` | `#6B46C1` (Royal Purple) |
| Astral Loom | `#161922` | `#F5F5F5` | `#FF7F0A` (Orange) |

## Project Phases

| Phase | Description | Budget |
|-------|-------------|--------|
| 1 | Design & Architecture | $110 |
| 2 | Core Publishing System & Full CMS | $290 |
| 3 | Monetization & Community Logic | $140 |
| 4 | Contribution & Review Engine | $100 |
| 5 | Testing & Launch | $110 |
| **Total** | | **$750** |

Timeline: 6-8 weeks (Agile Scrum methodology)

## Database Schema

The platform uses MongoDB with the following collections:

| Collection | Purpose |
|------------|---------|
| `users` | User accounts with roles (admin, editor, contributor, reader) |
| `categories` | Hierarchical category organization for wiki structure |
| `pages` | Wiki-style articles with full-text search |
| `revisions` | Edit history tracking for all content types |
| `books` | Serialized novels with chapter management |
| `chapters` | Individual chapters within books |
| `blogposts` | Blog articles |
| `shortstories` | Standalone short fiction |
| `comments` | Threaded comments on any content |
| `reactions` | Like/dislike tracking |
| `adplacements` | Ad zone configurations |
| `affiliatelinks` | Affiliate link management |
| `media` | Image and file storage metadata |
| `submissions` | Contribution review queue |
| `readingprogress` | User reading position tracking |
| `siteconfigs` | Site-wide settings, navigation, themes |

## Admin Panel Capabilities

- **Wiki Management**: Create, edit wiki pages with revision history
- Create, edit, and publish blog posts
- Upload and manage images
- Add and update affiliate links
- Manage SEO metadata (titles, descriptions, tags)
- Add, remove, and swap advertising placements
- Update book covers and book/product information
- Edit homepage sections and content
- Manage site navigation and categories
- Review and publish contributed submissions
- **Theme Customization**: Switch between color themes

## Ownership & Control

- **Domain**: Registered and owned by client
- **Source Code**: Full access via GitHub repository
- **Database**: Client-controlled access
- **Hosting**: Vercel account under client ownership
- **Portability**: Can be moved to another developer/host without rebuilding

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Setup

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
Create `.env.local` with:
```env
MONGODB_URI=mongodb://localhost:27017/wiki-platform
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
RESEND_API_KEY=your-resend-api-key
```

3. **Start MongoDB** (if using local)
```bash
mongod
```

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Future Scalability

The database architecture is built with scalability in mind for:
- Multi-domain hub support
- Multiple writing domains and genres
- Reader filtering across categories
