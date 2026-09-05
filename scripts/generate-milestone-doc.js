const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  ShadingType,
} = require("docx");
const fs = require("fs");

// Schema definitions
const schemas = [
  {
    name: "User",
    description: "User accounts with role-based access control",
    fields: [
      { name: "email", type: "String", required: true, description: "Unique email address" },
      { name: "password", type: "String", required: true, description: "Hashed password" },
      { name: "name", type: "String", required: true, description: "Full name" },
      { name: "displayName", type: "String", required: false, description: "Public display name" },
      { name: "avatar", type: "String", required: false, description: "Profile image URL" },
      { name: "role", type: "Enum", required: true, description: "admin | editor | contributor | reader" },
      { name: "bio", type: "String", required: false, description: "User biography (max 500 chars)" },
      { name: "isActive", type: "Boolean", required: true, description: "Account active status" },
      { name: "isVerified", type: "Boolean", required: true, description: "Email verification status" },
      { name: "preferences", type: "Object", required: true, description: "Theme and notification settings" },
    ],
  },
  {
    name: "Category",
    description: "Hierarchical category organization for wiki-style structure",
    fields: [
      { name: "name", type: "String", required: true, description: "Category name" },
      { name: "slug", type: "String", required: true, description: "URL-friendly identifier" },
      { name: "description", type: "String", required: false, description: "Category description" },
      { name: "parent", type: "ObjectId", required: false, description: "Parent category reference" },
      { name: "order", type: "Number", required: true, description: "Display order" },
      { name: "icon", type: "String", required: false, description: "Category icon" },
      { name: "coverImage", type: "String", required: false, description: "Category cover image" },
      { name: "seo", type: "Object", required: false, description: "SEO metadata" },
    ],
  },
  {
    name: "Page",
    description: "Wiki-style articles with revision support",
    fields: [
      { name: "title", type: "String", required: true, description: "Page title" },
      { name: "slug", type: "String", required: true, description: "URL-friendly identifier" },
      { name: "content", type: "String", required: true, description: "Page content (HTML/Markdown)" },
      { name: "excerpt", type: "String", required: false, description: "Short summary" },
      { name: "category", type: "ObjectId", required: false, description: "Category reference" },
      { name: "tags", type: "Array", required: false, description: "Content tags" },
      { name: "author", type: "ObjectId", required: true, description: "Original author" },
      { name: "lastEditedBy", type: "ObjectId", required: true, description: "Last editor" },
      { name: "status", type: "Enum", required: true, description: "draft | published | archived" },
      { name: "isLocked", type: "Boolean", required: true, description: "Edit lock status" },
      { name: "viewCount", type: "Number", required: true, description: "View counter" },
      { name: "editCount", type: "Number", required: true, description: "Edit counter" },
      { name: "seo", type: "Object", required: false, description: "SEO metadata" },
    ],
  },
  {
    name: "Revision",
    description: "Edit history tracking for all content types",
    fields: [
      { name: "contentType", type: "Enum", required: true, description: "page | book | chapter | blog | story" },
      { name: "contentId", type: "ObjectId", required: true, description: "Referenced content" },
      { name: "title", type: "String", required: true, description: "Title at revision time" },
      { name: "content", type: "String", required: true, description: "Content at revision time" },
      { name: "editedBy", type: "ObjectId", required: true, description: "Editor reference" },
      { name: "editSummary", type: "String", required: false, description: "Edit description" },
      { name: "version", type: "Number", required: true, description: "Version number" },
      { name: "isMinorEdit", type: "Boolean", required: true, description: "Minor edit flag" },
      { name: "diff", type: "Object", required: false, description: "Additions/deletions count" },
    ],
  },
  {
    name: "Book",
    description: "Serialized novels with chapter management",
    fields: [
      { name: "title", type: "String", required: true, description: "Book title" },
      { name: "slug", type: "String", required: true, description: "URL-friendly identifier" },
      { name: "synopsis", type: "String", required: true, description: "Book synopsis (max 1000 chars)" },
      { name: "description", type: "String", required: false, description: "Full description" },
      { name: "coverImage", type: "String", required: false, description: "Cover image URL" },
      { name: "author", type: "ObjectId", required: true, description: "Author reference" },
      { name: "contributors", type: "Array", required: false, description: "Co-author references" },
      { name: "category", type: "ObjectId", required: false, description: "Category reference" },
      { name: "tags", type: "Array", required: false, description: "Content tags" },
      { name: "genres", type: "Array", required: false, description: "Genre tags" },
      { name: "status", type: "Enum", required: true, description: "draft | ongoing | completed | hiatus | archived" },
      { name: "chapterCount", type: "Number", required: true, description: "Total chapters" },
      { name: "wordCount", type: "Number", required: true, description: "Total word count" },
      { name: "viewCount", type: "Number", required: true, description: "View counter" },
      { name: "likeCount", type: "Number", required: true, description: "Like counter" },
      { name: "seo", type: "Object", required: false, description: "SEO metadata" },
    ],
  },
  {
    name: "Chapter",
    description: "Individual chapters within books",
    fields: [
      { name: "book", type: "ObjectId", required: true, description: "Parent book reference" },
      { name: "title", type: "String", required: true, description: "Chapter title" },
      { name: "slug", type: "String", required: true, description: "URL-friendly identifier" },
      { name: "content", type: "String", required: true, description: "Chapter content" },
      { name: "chapterNumber", type: "Number", required: true, description: "Chapter order" },
      { name: "wordCount", type: "Number", required: true, description: "Word count" },
      { name: "isPublished", type: "Boolean", required: true, description: "Publication status" },
      { name: "viewCount", type: "Number", required: true, description: "View counter" },
      { name: "likeCount", type: "Number", required: true, description: "Like counter" },
      { name: "authorNote", type: "String", required: false, description: "Author's note" },
    ],
  },
  {
    name: "BlogPost",
    description: "Blog articles and announcements",
    fields: [
      { name: "title", type: "String", required: true, description: "Post title" },
      { name: "slug", type: "String", required: true, description: "URL-friendly identifier" },
      { name: "content", type: "String", required: true, description: "Post content" },
      { name: "excerpt", type: "String", required: false, description: "Short summary" },
      { name: "coverImage", type: "String", required: false, description: "Featured image" },
      { name: "author", type: "ObjectId", required: true, description: "Author reference" },
      { name: "category", type: "ObjectId", required: false, description: "Category reference" },
      { name: "tags", type: "Array", required: false, description: "Content tags" },
      { name: "status", type: "Enum", required: true, description: "draft | published | archived" },
      { name: "isFeatured", type: "Boolean", required: true, description: "Featured status" },
      { name: "viewCount", type: "Number", required: true, description: "View counter" },
      { name: "readingTime", type: "Number", required: true, description: "Estimated read time (minutes)" },
      { name: "seo", type: "Object", required: false, description: "SEO metadata" },
    ],
  },
  {
    name: "ShortStory",
    description: "Standalone short fiction pieces",
    fields: [
      { name: "title", type: "String", required: true, description: "Story title" },
      { name: "slug", type: "String", required: true, description: "URL-friendly identifier" },
      { name: "content", type: "String", required: true, description: "Story content" },
      { name: "synopsis", type: "String", required: false, description: "Story summary" },
      { name: "coverImage", type: "String", required: false, description: "Cover image" },
      { name: "author", type: "ObjectId", required: true, description: "Author reference" },
      { name: "tags", type: "Array", required: false, description: "Content tags" },
      { name: "genres", type: "Array", required: false, description: "Genre tags" },
      { name: "status", type: "Enum", required: true, description: "draft | published | archived" },
      { name: "isGuestContribution", type: "Boolean", required: true, description: "Guest submission flag" },
      { name: "wordCount", type: "Number", required: true, description: "Word count" },
      { name: "viewCount", type: "Number", required: true, description: "View counter" },
      { name: "seo", type: "Object", required: false, description: "SEO metadata" },
    ],
  },
  {
    name: "Comment",
    description: "Threaded comments on all content types",
    fields: [
      { name: "contentType", type: "Enum", required: true, description: "page | book | chapter | blog | story" },
      { name: "contentId", type: "ObjectId", required: true, description: "Referenced content" },
      { name: "author", type: "ObjectId", required: true, description: "Comment author" },
      { name: "content", type: "String", required: true, description: "Comment text (max 5000 chars)" },
      { name: "parent", type: "ObjectId", required: false, description: "Parent comment (for threading)" },
      { name: "likeCount", type: "Number", required: true, description: "Like counter" },
      { name: "dislikeCount", type: "Number", required: true, description: "Dislike counter" },
      { name: "isEdited", type: "Boolean", required: true, description: "Edit flag" },
      { name: "isDeleted", type: "Boolean", required: true, description: "Soft delete flag" },
      { name: "isApproved", type: "Boolean", required: true, description: "Moderation status" },
      { name: "isPinned", type: "Boolean", required: true, description: "Pinned status" },
    ],
  },
  {
    name: "Reaction",
    description: "Like/dislike tracking for content and comments",
    fields: [
      { name: "user", type: "ObjectId", required: true, description: "User reference" },
      { name: "contentType", type: "Enum", required: true, description: "page | book | chapter | blog | story | comment" },
      { name: "contentId", type: "ObjectId", required: true, description: "Referenced content" },
      { name: "type", type: "Enum", required: true, description: "like | dislike" },
    ],
  },
  {
    name: "AdPlacement",
    description: "Strategic ad zone configurations",
    fields: [
      { name: "name", type: "String", required: true, description: "Ad placement name" },
      { name: "zone", type: "Enum", required: true, description: "homepage-hero | homepage-sidebar | homepage-feed | article-top | article-sidebar | article-bottom | chapter-between | chapter-sidebar | navigation | footer" },
      { name: "type", type: "Enum", required: true, description: "banner | adsense | affiliate | custom" },
      { name: "content", type: "Object", required: true, description: "HTML, image URL, link, AdSense code" },
      { name: "dimensions", type: "Object", required: false, description: "Width, height, responsive flag" },
      { name: "targeting", type: "Object", required: false, description: "Categories, pages, devices" },
      { name: "schedule", type: "Object", required: false, description: "Start/end dates" },
      { name: "priority", type: "Number", required: true, description: "Display priority" },
      { name: "isActive", type: "Boolean", required: true, description: "Active status" },
      { name: "impressions", type: "Number", required: true, description: "Impression counter" },
      { name: "clicks", type: "Number", required: true, description: "Click counter" },
    ],
  },
  {
    name: "AffiliateLink",
    description: "Affiliate link management and tracking",
    fields: [
      { name: "name", type: "String", required: true, description: "Link name" },
      { name: "slug", type: "String", required: true, description: "Short URL slug" },
      { name: "program", type: "Enum", required: true, description: "amazon | bookshop | custom" },
      { name: "originalUrl", type: "String", required: true, description: "Original product URL" },
      { name: "affiliateUrl", type: "String", required: true, description: "Affiliate-tagged URL" },
      { name: "productType", type: "String", required: true, description: "Product category" },
      { name: "productImage", type: "String", required: false, description: "Product image" },
      { name: "description", type: "String", required: false, description: "Link description" },
      { name: "tags", type: "Array", required: false, description: "Tags for organization" },
      { name: "isActive", type: "Boolean", required: true, description: "Active status" },
      { name: "clicks", type: "Number", required: true, description: "Click counter" },
      { name: "conversions", type: "Number", required: true, description: "Conversion counter" },
    ],
  },
  {
    name: "Media",
    description: "Image and file storage management",
    fields: [
      { name: "filename", type: "String", required: true, description: "Stored filename" },
      { name: "originalFilename", type: "String", required: true, description: "Original filename" },
      { name: "url", type: "String", required: true, description: "File URL" },
      { name: "thumbnailUrl", type: "String", required: false, description: "Thumbnail URL" },
      { name: "type", type: "Enum", required: true, description: "image | video | document | other" },
      { name: "mimeType", type: "String", required: true, description: "MIME type" },
      { name: "size", type: "Number", required: true, description: "File size in bytes" },
      { name: "dimensions", type: "Object", required: false, description: "Width and height (images)" },
      { name: "altText", type: "String", required: false, description: "Alt text for accessibility" },
      { name: "folder", type: "String", required: false, description: "Organization folder" },
      { name: "tags", type: "Array", required: false, description: "Tags for organization" },
      { name: "uploadedBy", type: "ObjectId", required: true, description: "Uploader reference" },
    ],
  },
  {
    name: "Submission",
    description: "Contribution review queue for community submissions",
    fields: [
      { name: "type", type: "Enum", required: true, description: "book | story | blog | page" },
      { name: "title", type: "String", required: true, description: "Submission title" },
      { name: "content", type: "String", required: true, description: "Submission content" },
      { name: "synopsis", type: "String", required: false, description: "Content summary" },
      { name: "coverImage", type: "String", required: false, description: "Cover image" },
      { name: "category", type: "ObjectId", required: false, description: "Category reference" },
      { name: "tags", type: "Array", required: false, description: "Content tags" },
      { name: "submittedBy", type: "ObjectId", required: false, description: "Submitter (if registered)" },
      { name: "status", type: "Enum", required: true, description: "pending | under-review | accepted | declined" },
      { name: "reviewedBy", type: "ObjectId", required: false, description: "Reviewer reference" },
      { name: "reviewedAt", type: "Date", required: false, description: "Review timestamp" },
      { name: "reviewNote", type: "String", required: false, description: "Reviewer notes" },
      { name: "isGuest", type: "Boolean", required: true, description: "Guest submission flag" },
      { name: "guestEmail", type: "String", required: false, description: "Guest email" },
      { name: "guestName", type: "String", required: false, description: "Guest name" },
    ],
  },
  {
    name: "ReadingProgress",
    description: "User reading position tracking",
    fields: [
      { name: "user", type: "ObjectId", required: true, description: "User reference" },
      { name: "contentType", type: "Enum", required: true, description: "book | story | blog | page" },
      { name: "contentId", type: "ObjectId", required: true, description: "Content reference" },
      { name: "currentChapter", type: "ObjectId", required: false, description: "Current chapter (books)" },
      { name: "chapterProgress", type: "Number", required: false, description: "Progress in chapter (%)" },
      { name: "scrollPosition", type: "Number", required: false, description: "Scroll position" },
      { name: "percentComplete", type: "Number", required: true, description: "Overall progress (%)" },
      { name: "isCompleted", type: "Boolean", required: true, description: "Completion flag" },
      { name: "startedAt", type: "Date", required: true, description: "Start timestamp" },
      { name: "lastReadAt", type: "Date", required: true, description: "Last read timestamp" },
    ],
  },
  {
    name: "SiteConfig",
    description: "Site-wide settings, navigation, and theme configuration",
    fields: [
      { name: "siteName", type: "String", required: true, description: "Site name" },
      { name: "siteDescription", type: "String", required: false, description: "Site description" },
      { name: "logo", type: "String", required: false, description: "Logo URL" },
      { name: "favicon", type: "String", required: false, description: "Favicon URL" },
      { name: "theme", type: "Object", required: true, description: "Color scheme settings" },
      { name: "seo", type: "Object", required: true, description: "Default SEO settings" },
      { name: "navigation", type: "Object", required: true, description: "Main and footer navigation" },
      { name: "homepage", type: "Object", required: true, description: "Homepage sections config" },
      { name: "social", type: "Object", required: false, description: "Social media links" },
      { name: "analytics", type: "Object", required: false, description: "Analytics configuration" },
    ],
  },
];

// Create table for a schema
function createSchemaTable(schema) {
  const headerRow = new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: "Field", bold: true })] })],
        shading: { fill: "1A202C", type: ShadingType.SOLID },
        width: { size: 20, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: "Type", bold: true })] })],
        shading: { fill: "1A202C", type: ShadingType.SOLID },
        width: { size: 15, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: "Required", bold: true })] })],
        shading: { fill: "1A202C", type: ShadingType.SOLID },
        width: { size: 15, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true })] })],
        shading: { fill: "1A202C", type: ShadingType.SOLID },
        width: { size: 50, type: WidthType.PERCENTAGE },
      }),
    ],
  });

  const dataRows = schema.fields.map(
    (field) =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(field.name)] }),
          new TableCell({ children: [new Paragraph(field.type)] }),
          new TableCell({ children: [new Paragraph(field.required ? "Yes" : "No")] }),
          new TableCell({ children: [new Paragraph(field.description)] }),
        ],
      })
  );

  return new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

// Build document
const doc = new Document({
  sections: [
    {
      properties: {},
      children: [
        // Title
        new Paragraph({
          children: [
            new TextRun({
              text: "Marc's Wiki Platform",
              bold: true,
              size: 56,
              color: "1A202C",
            }),
          ],
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),

        // Subtitle
        new Paragraph({
          children: [
            new TextRun({
              text: "Milestone 1: Database Schema Architecture",
              size: 32,
              color: "666666",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),

        // Meta info
        new Paragraph({
          children: [
            new TextRun({ text: "Delivered by: ", bold: true }),
            new TextRun({ text: "Orvynexia" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Date: ", bold: true }),
            new TextRun({ text: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Phase: ", bold: true }),
            new TextRun({ text: "1 of 5 - Design & Architecture" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Budget: ", bold: true }),
            new TextRun({ text: "$110" }),
          ],
          spacing: { after: 400 },
        }),

        // Executive Summary
        new Paragraph({
          text: "Executive Summary",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "This document presents the complete database schema architecture for Marc's Wiki Platform. The platform combines wiki-style content management (similar to Fandom) with serialized fiction publishing capabilities. All schemas are designed using MongoDB with Mongoose ODM, optimized for scalability and future multi-domain expansion.",
            }),
          ],
          spacing: { after: 200 },
        }),

        // Tech Stack
        new Paragraph({
          text: "Technical Stack",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({ children: [new TextRun({ text: "• Framework: ", bold: true }), new TextRun("Next.js")] }),
        new Paragraph({ children: [new TextRun({ text: "• Database: ", bold: true }), new TextRun("MongoDB")] }),
        new Paragraph({ children: [new TextRun({ text: "• ODM: ", bold: true }), new TextRun("Mongoose")] }),
        new Paragraph({ children: [new TextRun({ text: "• Email: ", bold: true }), new TextRun("Resend")] }),
        new Paragraph({ children: [new TextRun({ text: "• Hosting: ", bold: true }), new TextRun("Vercel")], spacing: { after: 400 } }),

        // Schema Overview
        new Paragraph({
          text: "Schema Overview",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: "The database architecture consists of 16 interconnected collections:",
          spacing: { after: 200 },
        }),

        // Overview table
        new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Collection", bold: true })] })],
                  shading: { fill: "D4AF37", type: ShadingType.SOLID },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Purpose", bold: true })] })],
                  shading: { fill: "D4AF37", type: ShadingType.SOLID },
                }),
              ],
            }),
            ...schemas.map(
              (s) =>
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(s.name)] }),
                    new TableCell({ children: [new Paragraph(s.description)] }),
                  ],
                })
            ),
          ],
          width: { size: 100, type: WidthType.PERCENTAGE },
        }),

        // Detailed Schemas
        new Paragraph({
          text: "Detailed Schema Definitions",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 600, after: 200 },
        }),

        // Each schema
        ...schemas.flatMap((schema) => [
          new Paragraph({
            text: schema.name,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 100 },
          }),
          new Paragraph({
            text: schema.description,
            spacing: { after: 200 },
            italics: true,
          }),
          createSchemaTable(schema),
          new Paragraph({ text: "", spacing: { after: 200 } }),
        ]),

        // Key Features
        new Paragraph({
          text: "Key Architecture Features",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 600, after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "1. Wiki-Style Revision History", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "The Revision model tracks all changes to Pages, Books, Chapters, BlogPosts, and ShortStories. Each edit creates a new revision with version number, editor, and diff statistics.",
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "2. Hierarchical Categories", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Categories support parent-child relationships for wiki-style organization. This enables nested category structures like 'Fiction > Fantasy > Epic Fantasy'.",
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "3. Monetization-First Design", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "AdPlacement supports 10 strategic zones with targeting, scheduling, and analytics. AffiliateLink tracks clicks and conversions across multiple affiliate programs.",
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "4. Community Contributions", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "The Submission model enables a unified review queue for all community content. Supports both registered users and guest submissions with email notifications.",
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "5. Admin Self-Service", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "SiteConfig stores all customizable site settings including navigation, homepage sections, themes, and SEO defaults. No developer intervention required for routine changes.",
          spacing: { after: 400 },
        }),

        // File Structure
        new Paragraph({
          text: "File Structure",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `src/lib/db/
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
    └── SiteConfig.ts`,
              font: "Courier New",
              size: 20,
            }),
          ],
          spacing: { after: 400 },
        }),

        // Next Steps
        new Paragraph({
          text: "Next Steps - Phase 2",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({ text: "• Build reading UI (homepage, wiki pages, books, blogs)" }),
        new Paragraph({ text: "• Develop admin panel with WYSIWYG editors" }),
        new Paragraph({ text: "• Implement user authentication" }),
        new Paragraph({ text: "• Create category management system" }),
        new Paragraph({ text: "• Build media upload functionality", spacing: { after: 400 } }),

        // Signature
        new Paragraph({
          text: "___________________________",
          alignment: AlignmentType.LEFT,
          spacing: { before: 600 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Orvynexia", bold: true })],
        }),
        new Paragraph({
          text: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        }),
      ],
    },
  ],
});

// Generate document
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("Milestone-1-Schema-Architecture.docx", buffer);
  console.log("Document created: Milestone-1-Schema-Architecture.docx");
});
