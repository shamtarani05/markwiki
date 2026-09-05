import mongoose, { Schema, Document, Model } from 'mongoose';

export type BookStatus = 'draft' | 'ongoing' | 'completed' | 'hiatus' | 'archived';

export interface IBook extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  synopsis: string;
  description?: string;
  coverImage?: string;
  author: mongoose.Types.ObjectId;
  contributors: mongoose.Types.ObjectId[];
  category?: mongoose.Types.ObjectId;
  tags: string[];
  genres: string[];
  status: BookStatus;
  isPublished: boolean;
  isFeatured: boolean;
  chapterCount: number;
  wordCount: number;
  viewCount: number;
  likeCount: number;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  publishedAt?: Date;
  lastChapterAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
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
    synopsis: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    description: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contributors: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
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
      enum: ['draft', 'ongoing', 'completed', 'hiatus', 'archived'],
      default: 'draft',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    chapterCount: {
      type: Number,
      default: 0,
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
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    publishedAt: {
      type: Date,
    },
    lastChapterAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

BookSchema.index({ slug: 1 });
BookSchema.index({ author: 1 });
BookSchema.index({ category: 1 });
BookSchema.index({ status: 1, isPublished: 1 });
BookSchema.index({ isFeatured: 1 });
BookSchema.index({ tags: 1 });
BookSchema.index({ genres: 1 });
BookSchema.index({ title: 'text', synopsis: 'text' });

const Book: Model<IBook> = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);

export default Book;
