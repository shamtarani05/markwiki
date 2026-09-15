import mongoose, { Schema, Document, Model } from 'mongoose';

export type CommentableType = 'wiki' | 'page' | 'book' | 'chapter' | 'blog' | 'story';

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  contentType: CommentableType;
  contentId: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  parent?: mongoose.Types.ObjectId;
  likeCount: number;
  dislikeCount: number;
  isEdited: boolean;
  isDeleted: boolean;
  isApproved: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    contentType: {
      type: String,
      enum: ['wiki', 'page', 'book', 'chapter', 'blog', 'story'],
      required: true,
    },
    contentId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    dislikeCount: {
      type: Number,
      default: 0,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

CommentSchema.index({ contentType: 1, contentId: 1 });
CommentSchema.index({ author: 1 });
CommentSchema.index({ parent: 1 });
CommentSchema.index({ createdAt: -1 });

const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
