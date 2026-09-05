import mongoose, { Schema, Document, Model } from 'mongoose';

export type AdZone =
  | 'homepage-hero'
  | 'homepage-sidebar'
  | 'homepage-feed'
  | 'article-top'
  | 'article-sidebar'
  | 'article-bottom'
  | 'chapter-between'
  | 'chapter-sidebar'
  | 'navigation'
  | 'footer';

export type AdType = 'banner' | 'adsense' | 'affiliate' | 'custom';

export interface IAdPlacement extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  zone: AdZone;
  type: AdType;
  content: {
    html?: string;
    imageUrl?: string;
    linkUrl?: string;
    altText?: string;
    adsenseCode?: string;
  };
  dimensions: {
    width?: number;
    height?: number;
    responsive: boolean;
  };
  targeting: {
    categories?: mongoose.Types.ObjectId[];
    pages?: string[];
    devices?: ('desktop' | 'tablet' | 'mobile')[];
  };
  schedule: {
    startDate?: Date;
    endDate?: Date;
  };
  priority: number;
  isActive: boolean;
  impressions: number;
  clicks: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AdPlacementSchema = new Schema<IAdPlacement>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    zone: {
      type: String,
      enum: [
        'homepage-hero',
        'homepage-sidebar',
        'homepage-feed',
        'article-top',
        'article-sidebar',
        'article-bottom',
        'chapter-between',
        'chapter-sidebar',
        'navigation',
        'footer',
      ],
      required: true,
    },
    type: {
      type: String,
      enum: ['banner', 'adsense', 'affiliate', 'custom'],
      required: true,
    },
    content: {
      html: String,
      imageUrl: String,
      linkUrl: String,
      altText: String,
      adsenseCode: String,
    },
    dimensions: {
      width: Number,
      height: Number,
      responsive: {
        type: Boolean,
        default: true,
      },
    },
    targeting: {
      categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
      }],
      pages: [String],
      devices: [{
        type: String,
        enum: ['desktop', 'tablet', 'mobile'],
      }],
    },
    schedule: {
      startDate: Date,
      endDate: Date,
    },
    priority: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    impressions: {
      type: Number,
      default: 0,
    },
    clicks: {
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

AdPlacementSchema.index({ zone: 1, isActive: 1 });
AdPlacementSchema.index({ priority: -1 });

const AdPlacement: Model<IAdPlacement> =
  mongoose.models.AdPlacement || mongoose.model<IAdPlacement>('AdPlacement', AdPlacementSchema);

export default AdPlacement;
