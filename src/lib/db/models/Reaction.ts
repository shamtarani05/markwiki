import mongoose, { Schema, Document, Model } from 'mongoose';

export type ReactableType = 'page' | 'book' | 'chapter' | 'blog' | 'story' | 'comment';
export type ReactionType = 'like' | 'dislike';

export interface IReaction extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  contentType: ReactableType;
  contentId: mongoose.Types.ObjectId;
  type: ReactionType;
  createdAt: Date;
}

const ReactionSchema = new Schema<IReaction>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contentType: {
      type: String,
      enum: ['page', 'book', 'chapter', 'blog', 'story', 'comment'],
      required: true,
    },
    contentId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      enum: ['like', 'dislike'],
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

ReactionSchema.index({ user: 1, contentType: 1, contentId: 1 }, { unique: true });
ReactionSchema.index({ contentType: 1, contentId: 1, type: 1 });

const Reaction: Model<IReaction> =
  mongoose.models.Reaction || mongoose.model<IReaction>('Reaction', ReactionSchema);

export default Reaction;
