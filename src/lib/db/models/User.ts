import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'admin' | 'editor' | 'contributor' | 'reader';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  displayName?: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
  isActive: boolean;
  isVerified: boolean;
  lastLogin?: Date;
  preferences: {
    theme: 'light' | 'dark';
    emailNotifications: boolean;
    // Which wiki-page editor this admin gets by default — Block (Notion/
    // Gutenberg-style discrete blocks) or Text (continuous Wikipedia/Word-
    // style document). Both write the same Page.blocks shape and render
    // through the same BlockRenderer, so switching is always safe/lossless.
    editorMode: 'block' | 'text';
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'editor', 'contributor', 'reader'],
      default: 'reader',
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'dark',
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      editorMode: {
        type: String,
        enum: ['block', 'text'],
        default: 'block',
      },
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
