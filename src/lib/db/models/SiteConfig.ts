import mongoose, { Schema, Document, Model } from 'mongoose';
import type { Block } from '@/src/lib/blocks/types';

export interface INavItem {
  label: string;
  url: string;
  order: number;
  isExternal: boolean;
  children?: INavItem[];
}

export interface ISiteConfig extends Document {
  _id: mongoose.Types.ObjectId;
  siteName: string;
  siteDescription: string;
  logo?: string;
  favicon?: string;
  theme: {
    name: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
  };
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    defaultKeywords: string[];
    ogImage?: string;
  };
  navigation: {
    main: INavItem[];
    footer: INavItem[];
  };
  homepage: {
    blocks: Block[];
  };
  social: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    discord?: string;
  };
  analytics: {
    googleAnalyticsId?: string;
  };
  updatedAt: Date;
}

const NavItemSchema = new Schema({
  label: { type: String, required: true },
  url: { type: String, required: true },
  order: { type: Number, default: 0 },
  isExternal: { type: Boolean, default: false },
  children: [{ type: Schema.Types.Mixed }],
}, { _id: false });



const SiteConfigSchema = new Schema<ISiteConfig>(
  {
    siteName: {
      type: String,
      required: true,
      default: 'Wiki Platform',
    },
    siteDescription: {
      type: String,
      default: '',
    },
    logo: String,
    favicon: String,
    theme: {
      name: { type: String, default: 'midnight-library' },
      primaryColor: { type: String, default: '#D4AF37' },
      secondaryColor: { type: String, default: '#1A202C' },
      accentColor: { type: String, default: '#D4AF37' },
      backgroundColor: { type: String, default: '#121212' },
      textColor: { type: String, default: '#E0E0E0' },
    },
    seo: {
      defaultTitle: { type: String, default: 'Wiki Platform' },
      titleTemplate: { type: String, default: '%s | Wiki Platform' },
      defaultDescription: { type: String, default: '' },
      defaultKeywords: [String],
      ogImage: String,
    },
    navigation: {
      main: [NavItemSchema],
      footer: [NavItemSchema],
    },
    homepage: {
      blocks: {
        type: [
          {
            id: { type: String, required: true },
            type: { type: String, required: true },
            props: { type: Schema.Types.Mixed, default: {} },
          },
        ],
        default: [],
        _id: false,
      },
    },
    social: {
      twitter: String,
      facebook: String,
      instagram: String,
      discord: String,
    },
    analytics: {
      googleAnalyticsId: String,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

const SiteConfig: Model<ISiteConfig> =
  mongoose.models.SiteConfig || mongoose.model<ISiteConfig>('SiteConfig', SiteConfigSchema);

export default SiteConfig;
