import mongoose, { Schema, Document, Model } from 'mongoose';

export type StoryStatus = 'draft' | 'published' | 'archived';

export interface IShortStory extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  synopsis?: string;
  coverImage?: string;
  author: mongoose.Types.ObjectId;
  category?: mongoose.Types.ObjectId;
  tags: string[];
  genres: string[];
  status: StoryStatus;
  isFeatured: boolean;
  isGuestContribution: boolean;
  wordCount: number;
  viewCount: number;
  likeCount: number;
  readingTime: number;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ShortStorySchema = new Schema<IShortStory>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    synopsis: {
      type: String,
      maxlength: 500,
    },
    coverImage: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    genres: [{
      type: String,
      trim: true,
    }],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isGuestContribution: {
      type: Boolean,
      default: false,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    readingTime: {
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

ShortStorySchema.index({ slug: 1 });
ShortStorySchema.index({ author: 1 });
ShortStorySchema.index({ category: 1 });
ShortStorySchema.index({ status: 1 });
ShortStorySchema.index({ isFeatured: 1 });
ShortStorySchema.index({ isGuestContribution: 1 });
ShortStorySchema.index({ tags: 1 });
ShortStorySchema.index({ genres: 1 });
ShortStorySchema.index({ title: 'text', content: 'text' });

const ShortStory: Model<IShortStory> =
  mongoose.models.ShortStory || mongoose.model<IShortStory>('ShortStory', ShortStorySchema);

export default ShortStory;
