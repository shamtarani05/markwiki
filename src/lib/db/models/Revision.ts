import mongoose, { Schema, Document, Model } from 'mongoose';

export type RevisionContentType = 'page' | 'book' | 'chapter' | 'blog' | 'story';

export interface IRevision extends Document {
  _id: mongoose.Types.ObjectId;
  contentType: RevisionContentType;
  contentId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  editedBy: mongoose.Types.ObjectId;
  editSummary?: string;
  version: number;
  isMinorEdit: boolean;
  status: 'pending' | 'applied' | 'rejected';
  diff?: {
    additions: number;
    deletions: number;
  };
  createdAt: Date;
}

const RevisionSchema = new Schema<IRevision>(
  {
    contentType: {
      type: String,
      enum: ['page', 'book', 'chapter', 'blog', 'story'],
      required: true,
    },
    contentId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'contentType',
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    editedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    editSummary: {
      type: String,
      maxlength: 500,
    },
    version: {
      type: Number,
      required: true,
    },
    isMinorEdit: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'applied', 'rejected'],
      default: 'applied',
    },
    diff: {
      additions: Number,
      deletions: Number,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

RevisionSchema.index({ contentType: 1, contentId: 1 });
RevisionSchema.index({ contentId: 1, version: -1 });
RevisionSchema.index({ editedBy: 1 });
RevisionSchema.index({ createdAt: -1 });
RevisionSchema.index({ status: 1 });

const Revision: Model<IRevision> =
  mongoose.models.Revision || mongoose.model<IRevision>('Revision', RevisionSchema);

export default Revision;
