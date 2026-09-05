import mongoose, { Schema, Document, Model } from 'mongoose';
import type { Block, BlockType } from '@/src/lib/blocks/types';
import type { PageArchetype } from '@/src/lib/blocks/templates';

export type PageStatus = 'draft' | 'published' | 'archived';

export interface IPage extends Document {
  _id: mongoose.Types.ObjectId;
  // The wiki (franchise container) this page belongs to — a wiki has many
  // pages of different archetypes, e.g. one Overview plus many Character/
  // Location/Episode pages. Slugs are only unique within a wiki, matching
  // the public /wiki/[wikiSlug]/[pageSlug] URL shape.
  wiki: mongoose.Types.ObjectId;
  pageType: PageArchetype;
  title: string;
  slug: string;
  // Ordered block layout — the source of truth for page content, built by the
  // drag-and-drop admin canvas. `templateKey` just records which starter
  // template (if any) the page began from; it has no effect once saved.
  blocks: Block[];
  templateKey?: string;
  // Flattened plain text pulled from text-bearing blocks, kept in sync by a
  // pre-save hook, so full-text search doesn't need to parse block HTML.
  searchText: string;
  excerpt?: string;
  coverImage?: string;
  category?: mongoose.Types.ObjectId;
  tags: string[];
  author: mongoose.Types.ObjectId;
  lastEditedBy: mongoose.Types.ObjectId;
  status: PageStatus;
  isLocked: boolean;
  lockedBy?: mongoose.Types.ObjectId;
  lockedAt?: Date;
  viewCount: number;
  // How many times this page has surfaced in a search result someone
  // actually viewed — a second, independent trending signal alongside raw
  // views (a page people search for and click is a stronger "this matters
  // right now" signal than a page someone stumbled onto via a link).
  searchCount: number;
  editCount: number;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema = new Schema<IPage>(
  {
    wiki: {
      type: Schema.Types.ObjectId,
      ref: 'Wiki',
      required: true,
    },
    pageType: {
      type: String,
      enum: ['overview', 'character', 'location', 'episode', 'blank'],
      default: 'blank',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    blocks: {
      type: [
        {
          id: { type: String, required: true },
          type: { type: String, required: true },
          props: { type: Schema.Types.Mixed, default: {} },
        },
      ],
      default: [],
      _id: false,
    },
    templateKey: {
      type: String,
    },
    searchText: {
      type: String,
      default: '',
    },
    excerpt: {
      type: String,
      maxlength: 500,
    },
    coverImage: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastEditedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    lockedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    lockedAt: {
      type: Date,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    searchCount: {
      type: Number,
      default: 0,
    },
    editCount: {
      type: Number,
      default: 0,
    },
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const TEXT_BLOCK_TYPES: BlockType[] = ['heading', 'richText', 'quote', 'infobox'];

function extractBlockText(block: Block): string {
  switch (block.type) {
    case 'heading':
      return block.props.text;
    case 'richText':
      return block.props.html.replace(/<[^>]+>/g, ' ');
    case 'quote':
      return [block.props.text, block.props.source].filter(Boolean).join(' ');
    case 'infobox':
      return [
        block.props.title,
        block.props.subtitle,
        ...block.props.fields.map((f) => `${f.label} ${f.value}`),
      ].filter(Boolean).join(' ');
    default:
      return '';
  }
}

PageSchema.pre('save', function () {
  if (this.isModified('blocks')) {
    this.searchText = this.blocks
      .filter((b) => TEXT_BLOCK_TYPES.includes(b.type))
      .map(extractBlockText)
      .join(' ')
      .slice(0, 20000);
  }
});

PageSchema.index({ wiki: 1, slug: 1 }, { unique: true });
PageSchema.index({ category: 1 });
PageSchema.index({ status: 1 });
PageSchema.index({ tags: 1 });
PageSchema.index({ author: 1 });
PageSchema.index({ title: 'text', searchText: 'text' });

const Page: Model<IPage> = mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);

export default Page;
