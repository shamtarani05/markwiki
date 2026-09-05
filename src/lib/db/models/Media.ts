import mongoose, { Schema, Document, Model } from 'mongoose';

export type MediaType = 'image' | 'video' | 'document' | 'other';

export interface IMedia extends Document {
  _id: mongoose.Types.ObjectId;
  filename: string;
  originalFilename: string;
  url: string;
  thumbnailUrl?: string;
  type: MediaType;
  mimeType: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  altText?: string;
  caption?: string;
  folder?: string;
  tags: string[];
  uploadedBy: mongoose.Types.ObjectId;
  usedIn: {
    contentType: string;
    contentId: mongoose.Types.ObjectId;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    filename: {
      type: String,
      required: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
    },
    type: {
      type: String,
      enum: ['image', 'video', 'document', 'other'],
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    dimensions: {
      width: Number,
      height: Number,
    },
    altText: {
      type: String,
      maxlength: 200,
    },
    caption: {
      type: String,
      maxlength: 500,
    },
    folder: {
      type: String,
      default: 'general',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    usedIn: [{
      contentType: String,
      contentId: Schema.Types.ObjectId,
    }],
  },
  {
    timestamps: true,
  }
);

MediaSchema.index({ type: 1 });
MediaSchema.index({ folder: 1 });
MediaSchema.index({ uploadedBy: 1 });
MediaSchema.index({ tags: 1 });
MediaSchema.index({ createdAt: -1 });

const Media: Model<IMedia> = mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);

export default Media;
