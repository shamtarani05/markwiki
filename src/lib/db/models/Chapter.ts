import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChapter extends Document {
  _id: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  content?: string; // Optional for Webtoons
  images?: string[]; // Array of image URLs for Webtoons
  chapterNumber: number;
  wordCount: number;
  isPublished: boolean;
  viewCount: number;
  likeCount: number;
  authorNote?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChapterSchema = new Schema<IChapter>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
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
    content: {
      type: String,
    },
    images: [{
      type: String,
    }],
    chapterNumber: {
      type: Number,
      required: true,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    authorNote: {
      type: String,
      maxlength: 2000,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

ChapterSchema.index({ book: 1, chapterNumber: 1 });
ChapterSchema.index({ book: 1, slug: 1 }, { unique: true });
ChapterSchema.index({ isPublished: 1 });

const Chapter: Model<IChapter> =
  mongoose.models.Chapter || mongoose.model<IChapter>('Chapter', ChapterSchema);

export default Chapter;
