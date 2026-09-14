// Shared block system for the drag-and-drop page builder.
// A "page" of any content type (Wiki Page today, Book/Chapter next) is stored
// as an ordered array of these blocks. Templates below just pre-fill this
// array as a starting point — nothing here is enforced once the admin starts
// editing; every block can be added, removed, reordered, or edited freely.

export type BlockType =
  | 'heading'
  | 'richText'
  | 'image'
  | 'gallery'
  | 'videoEmbed'
  | 'quote'
  | 'infobox'
  | 'tableOfContents'
  | 'cardGrid'
  | 'carousel'
  | 'ctaButton'
  | 'newsletter'
  | 'comments'
  | 'adSlot'
  | 'wikiStats'
  | 'trendingPages'
  | 'recentActivity'
  | 'hero'
  | 'continueReading'
  | 'categories'
  | 'featuredWikis'
  | 'community'
  | 'publishCTA'
  | 'featuredBooks'
  | 'latestStories'
  | 'blogPosts';

export interface HeadingProps {
  text: string;
  level: 2 | 3;
}

export interface RichTextProps {
  html: string;
}

export interface ImageProps {
  src: string;
  alt: string;
  caption?: string;
}

export interface GalleryProps {
  images: { src: string; alt: string; caption?: string }[];
  columns: 2 | 3 | 4;
}

export interface VideoEmbedProps {
  url: string;
  caption?: string;
}

export interface QuoteProps {
  text: string;
  source?: string;
}

export interface InfoboxField {
  label: string;
  value: string;
}

export interface InfoboxProps {
  title: string;
  subtitle?: string;
  image?: string;
  imageCaption?: string;
  fields: InfoboxField[];
}

export interface TableOfContentsProps {
  title?: string;
}

export interface CardGridItem {
  title: string;
  subtitle?: string;
  image?: string;
  href?: string;
}

export interface CardGridProps {
  title?: string;
  columns: 2 | 3 | 4;
  items: CardGridItem[];
}

export interface CarouselProps {
  title?: string;
  items: CardGridItem[];
}

export interface CTAButtonProps {
  text: string;
  href: string;
  style: 'primary' | 'secondary';
  align: 'left' | 'center' | 'right';
}

export interface NewsletterProps {
  title?: string;
  subtitle?: string;
}

export interface CommentsProps {
  title?: string;
}

export interface AdSlotProps {
  zone: string;
}

export interface WikiStatsProps {}

export interface TrendingPagesProps {
  limit: number;
}

export interface RecentActivityProps {
  limit: number;
}

export interface HeroProps {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  heroSearchPlaceholder?: string;
  popularLinks?: { label: string; href: string }[];
}

export interface ContinueReadingProps {
  itemCount?: number;
}

export interface CategoriesProps {
  backgroundStyle?: 'default' | 'secondary' | 'gradient';
}

export interface FeaturedWikisProps {
  itemCount?: number;
}

export interface CommunityProps {}

export interface PublishCTAProps {
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
}

export interface FeaturedBooksProps {
  itemCount?: number;
}

export interface LatestStoriesProps {
  itemCount?: number;
}

export interface BlogPostsProps {
  itemCount?: number;
}

export interface BlockPropsMap {
  heading: HeadingProps;
  richText: RichTextProps;
  image: ImageProps;
  gallery: GalleryProps;
  videoEmbed: VideoEmbedProps;
  quote: QuoteProps;
  infobox: InfoboxProps;
  tableOfContents: TableOfContentsProps;
  cardGrid: CardGridProps;
  carousel: CarouselProps;
  ctaButton: CTAButtonProps;
  newsletter: NewsletterProps;
  comments: CommentsProps;
  adSlot: AdSlotProps;
  wikiStats: WikiStatsProps;
  trendingPages: TrendingPagesProps;
  recentActivity: RecentActivityProps;
  hero: HeroProps;
  continueReading: ContinueReadingProps;
  categories: CategoriesProps;
  featuredWikis: FeaturedWikisProps;
  community: CommunityProps;
  publishCTA: PublishCTAProps;
  featuredBooks: FeaturedBooksProps;
  latestStories: LatestStoriesProps;
  blogPosts: BlogPostsProps;
}

// Discriminated union built from BlockPropsMap: `block.type` narrows
// `block.props` to the matching props interface in switches/if-checks.
export type Block = {
  [K in BlockType]: { id: string; type: K; props: BlockPropsMap[K] };
}[BlockType];

export const BLOCK_LABELS: Record<BlockType, string> = {
  heading: 'Heading',
  richText: 'Text',
  image: 'Image',
  gallery: 'Gallery',
  videoEmbed: 'Video Embed',
  quote: 'Quote',
  infobox: 'Infobox',
  tableOfContents: 'Table of Contents',
  cardGrid: 'Card Grid',
  carousel: 'Carousel',
  ctaButton: 'CTA Button',
  newsletter: 'Newsletter Signup',
  comments: 'Comments',
  adSlot: 'Ad Slot',
  wikiStats: 'Wiki Stats',
  trendingPages: 'Trending Pages',
  recentActivity: 'Recent Activity',
  hero: 'Hero Section',
  continueReading: 'Continue Reading',
  categories: 'Categories',
  featuredWikis: 'Featured Wikis',
  community: 'Community News',
  publishCTA: 'Contribute CTA',
  featuredBooks: 'Featured Books',
  latestStories: 'Latest Stories',
  blogPosts: 'Blog Posts',
};

export const BLOCK_DESCRIPTIONS: Record<BlockType, string> = {
  heading: 'Section heading (also powers the table of contents)',
  richText: 'Formatted paragraph text',
  image: 'A single image with optional caption',
  gallery: 'A grid of images',
  videoEmbed: 'Embedded video by URL',
  quote: 'Pull-quote with an optional source',
  infobox: 'Sidebar summary box (image + label/value fields)',
  tableOfContents: 'Auto-built from the headings on this page',
  cardGrid: 'Grid of linked cards',
  carousel: 'Horizontally scrolling row of cards',
  ctaButton: 'Call-to-action button',
  newsletter: 'Newsletter signup form',
  comments: 'Reader comments thread',
  adSlot: 'Ad placement (references an AdPlacement zone)',
  wikiStats: 'Live page/view counters for this wiki (renders on the wiki cover page only)',
  trendingPages: "This wiki's most-viewed/most-searched pages, computed live",
  recentActivity: "This wiki's latest edits, computed live",
  hero: 'Main banner with search bar and quick links',
  continueReading: 'Resume cards for logged-in users (auto-hidden for guests)',
  categories: 'Browse by category (Anime, Games, Web Novels, etc.)',
  featuredWikis: 'Showcase top wikis with cover art carousel',
  community: 'Latest community updates and wiki edits',
  publishCTA: 'Call-to-action to contribute or start a wiki',
  featuredBooks: 'Showcase featured books and novels',
  latestStories: 'Recently published short stories',
  blogPosts: 'Latest blog articles',
};

let blockIdCounter = 0;

export function createBlockId(): string {
  blockIdCounter += 1;
  return `blk_${Date.now().toString(36)}_${blockIdCounter}`;
}

export function createBlock<T extends BlockType>(
  type: T,
  props: BlockPropsMap[T]
): Extract<Block, { type: T }> {
  return { id: createBlockId(), type, props } as Extract<Block, { type: T }>;
}

// Shared save-payload shape for both the Block editor and the Text editor —
// they're interchangeable, so callers (the admin routes) don't need to know
// which one produced this.
export interface PageBuilderSaveData {
  title: string;
  blocks: Block[];
  templateKey?: string;
  editSummary?: string;
  coverImage?: string;
}

export const DEFAULT_BLOCK_PROPS: { [K in BlockType]: BlockPropsMap[K] } = {
  heading: { text: 'New Heading', level: 2 },
  richText: { html: '<p>Start writing...</p>' },
  image: { src: '', alt: '' },
  gallery: { images: [], columns: 3 },
  videoEmbed: { url: '' },
  quote: { text: '' },
  infobox: { title: '', fields: [] },
  tableOfContents: { title: 'Contents' },
  cardGrid: { columns: 3, items: [] },
  carousel: { items: [] },
  ctaButton: { text: 'Learn More', href: '#', style: 'primary', align: 'left' },
  newsletter: { title: 'Subscribe for updates' },
  comments: {},
  adSlot: { zone: 'article-top' },
  wikiStats: {},
  trendingPages: { limit: 4 },
  recentActivity: { limit: 5 },
  hero: { heroTitle: 'Welcome' },
  continueReading: { itemCount: 6 },
  categories: { backgroundStyle: 'secondary' },
  featuredWikis: { itemCount: 8 },
  community: {},
  publishCTA: { ctaPrimaryText: 'Get Started' },
  featuredBooks: { itemCount: 8 },
  latestStories: { itemCount: 8 },
  blogPosts: { itemCount: 3 },
};
