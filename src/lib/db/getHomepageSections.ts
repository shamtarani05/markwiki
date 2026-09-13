// Server-side helper to load homepage sections from SiteConfig.
// Used by the public homepage and the admin homepage builder.

import connectDB from '@/src/lib/db/connection';
import SiteConfig from '@/src/lib/db/models/SiteConfig';
import type { HomepageSection } from '@/src/lib/db/homepageSections';
import { getDefaultHomepageSections } from '@/src/lib/db/homepageSections';

/**
 * Returns the homepage sections, sorted by order and (if `activeOnly`)
 * filtered to only active sections.
 *
 * If no SiteConfig document exists yet, or it has an empty sections array,
 * falls back to the hardcoded default layout so the site works identically
 * before the admin ever touches the homepage builder.
 */
export async function getHomepageSections(
  activeOnly = true
): Promise<HomepageSection[]> {
  await connectDB();

  const config = await SiteConfig.findOne().lean();
  let sections = config?.homepage?.sections as HomepageSection[] | undefined;

  if (!sections || sections.length === 0) {
    sections = getDefaultHomepageSections();
  }

  const sorted = [...sections].sort((a, b) => a.order - b.order);
  return activeOnly ? sorted.filter((s) => s.isActive) : sorted;
}
