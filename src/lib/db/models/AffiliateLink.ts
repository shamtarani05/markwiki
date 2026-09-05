import mongoose, { Schema, Document, Model } from 'mongoose';

export type AffiliateProgram = 'amazon' | 'bookshop' | 'custom';

export interface IAffiliateLink extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  program: AffiliateProgram;
  originalUrl: string;
  affiliateUrl: string;
  productType: string;
  productImage?: string;
  description?: string;
  tags: string[];
  isActive: boolean;
  clicks: number;
  conversions: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AffiliateLinkSchema = new Schema<IAffiliateLink>(
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
    program: {
      type: String,
      enum: ['amazon', 'bookshop', 'custom'],
      required: true,
    },
    originalUrl: {
      type: String,
      required: true,
    },
    affiliateUrl: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      required: true,
      trim: true,
    },
    productImage: {
      type: String,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    conversions: {
      type: Number,
      default: 0,
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

AffiliateLinkSchema.index({ slug: 1 });
AffiliateLinkSchema.index({ program: 1 });
AffiliateLinkSchema.index({ productType: 1 });
AffiliateLinkSchema.index({ isActive: 1 });
AffiliateLinkSchema.index({ tags: 1 });

const AffiliateLink: Model<IAffiliateLink> =
  mongoose.models.AffiliateLink || mongoose.model<IAffiliateLink>('AffiliateLink', AffiliateLinkSchema);

export default AffiliateLink;
