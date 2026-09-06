import mongoose, { Schema, Document, Model } from 'mongoose';

// A Wiki is the franchise/series container (e.g. "Lord of the Mysteries",
// "Solo Leveling") that groups together the many pages belonging to it
// (Character, Location, Episode, Overview...). It sits one level under the
// broad homepage topic Category (Anime, Web Novels, ...) — Category is the
// topic taxonomy, Wiki is the specific thing being documented within it.
export interface IWiki extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  category: mongoose.Types.ObjectId;
  pageCount: number;
  isFeatured: boolean;
  status: 'draft' | 'pending' | 'approved';
  coverPage?: mongoose.Types.ObjectId;
  reviewNote?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WikiSchema = new Schema<IWiki>(
  {
    name: {
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
    description: {
      type: String,
      maxlength: 1000,
    },
    coverImage: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    pageCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved'],
      default: 'draft',
    },
    coverPage: {
      type: Schema.Types.ObjectId,
      ref: 'Page',
    },
    reviewNote: {
      type: String,
      maxlength: 2000,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

WikiSchema.index({ slug: 1 });
WikiSchema.index({ category: 1 });
WikiSchema.index({ status: 1 });

const Wiki: Model<IWiki> = mongoose.models.Wiki || mongoose.model<IWiki>('Wiki', WikiSchema);

export default Wiki;
