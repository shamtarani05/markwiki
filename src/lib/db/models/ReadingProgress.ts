import mongoose, { Schema, Document, Model } from 'mongoose';

export type ReadableType = 'book' | 'story' | 'blog' | 'page';

export interface IReadingProgress extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  contentType: ReadableType;
  contentId: mongoose.Types.ObjectId;
  currentChapter?: mongoose.Types.ObjectId;
  chapterProgress?: number;
  scrollPosition?: number;
  percentComplete: number;
  isCompleted: boolean;
  startedAt: Date;
  lastReadAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReadingProgressSchema = new Schema<IReadingProgress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contentType: {
      type: String,
      enum: ['book', 'story', 'blog', 'page'],
      required: true,
    },
    contentId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    currentChapter: {
      type: Schema.Types.ObjectId,
      ref: 'Chapter',
    },
    chapterProgress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    scrollPosition: {
      type: Number,
      default: 0,
    },
    percentComplete: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    lastReadAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

ReadingProgressSchema.index({ user: 1, contentType: 1, contentId: 1 }, { unique: true });
ReadingProgressSchema.index({ user: 1, lastReadAt: -1 });
ReadingProgressSchema.index({ user: 1, isCompleted: 1 });

const ReadingProgress: Model<IReadingProgress> =
  mongoose.models.ReadingProgress || mongoose.model<IReadingProgress>('ReadingProgress', ReadingProgressSchema);

export default ReadingProgress;
