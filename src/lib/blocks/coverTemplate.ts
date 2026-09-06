import { Block, createBlock } from './types';

// Auto-applied the moment a Wiki is created (see Task 9's POST /api/admin/wikis)
// — never picked from TemplatePicker, so it lives outside PAGE_TEMPLATES.
export function buildCoverPageBlocks(wikiName: string, description?: string): Block[] {
  return [
    createBlock('richText', { html: `<p>${description || `The ${wikiName} wiki.`}</p>` }),
    createBlock('wikiStats', {}),
    createBlock('heading', { text: 'Trending Pages', level: 2 }),
    createBlock('trendingPages', { limit: 4 }),
    createBlock('heading', { text: 'Recent Activity', level: 2 }),
    createBlock('recentActivity', { limit: 5 }),
    createBlock('heading', { text: 'Browse Pages', level: 2 }),
    createBlock('cardGrid', { columns: 3, items: [] }),
  ];
}
