// Server-side helper to load homepage sections from SiteConfig.
// Used by the public homepage and the admin homepage builder.

import connectDB from '@/src/lib/db/connection';
import SiteConfig from '@/src/lib/db/models/SiteConfig';
import type { Block } from '@/src/lib/blocks/types';
import { getDefaultHomepageSections } from '@/src/lib/db/homepageSections';

/**
 * Returns the homepage sections, sorted by order and (if `activeOnly`)
 * filtered to only active sections.
 *
 * If no SiteConfig document exists yet, or it has an empty sections array,
 * falls back to the hardcoded default layout so the site works identically
 * before the admin ever touches the homepage builder.
 */
export async function getHomepageSections(): Promise<Block[]> {
  await connectDB();

  const config = await SiteConfig.findOne().lean();
  let blocks = config?.homepage?.blocks as Block[] | undefined;

  if (!blocks || blocks.length === 0) {
    blocks = getDefaultHomepageSections();
  }

  return blocks;
}
