import mongoose, { Schema, Document, Model } from 'mongoose';

export type SubmissionType = 'book' | 'story' | 'blog' | 'page';
export type SubmissionStatus = 'pending' | 'under-review' | 'accepted' | 'declined';

export interface ISubmission extends Document {
  _id: mongoose.Types.ObjectId;
  type: SubmissionType;
  title: string;
  content: string;
  synopsis?: string;
  coverImage?: string;
  category?: mongoose.Types.ObjectId;
  tags: string[];
  submittedBy: mongoose.Types.ObjectId;
  status: SubmissionStatus;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  reviewNote?: string;
  publishedContentId?: mongoose.Types.ObjectId;
  isGuest: boolean;
  guestEmail?: string;
  guestName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    type: {
      type: String,
      enum: ['book', 'story', 'blog', 'page'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    synopsis: {
      type: String,
      maxlength: 1000,
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
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'under-review', 'accepted', 'declined'],
      default: 'pending',
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    reviewNote: {
      type: String,
      maxlength: 2000,
    },
    publishedContentId: {
      type: Schema.Types.ObjectId,
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    guestEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    guestName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

SubmissionSchema.index({ status: 1 });
SubmissionSchema.index({ type: 1 });
SubmissionSchema.index({ submittedBy: 1 });
SubmissionSchema.index({ createdAt: -1 });

const Submission: Model<ISubmission> =
  mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);

export default Submission;
