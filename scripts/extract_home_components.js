const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../app/(site)/page.tsx');
const content = fs.readFileSync(pagePath, 'utf-8');

const componentsDir = path.join(__dirname, '../src/components/home');

function extractSection(name, markerRegex, settingsProp = 'settings') {
  const match = content.match(markerRegex);
  if (!match) return;
  const sectionContent = match[1];
  
  const componentCode = `import Link from 'next/link';
import type { HomepageSectionSettings } from '@/src/lib/db/homepageSections';

export default function ${name}({ ${settingsProp} }: { ${settingsProp}?: HomepageSectionSettings | any }) {
  return (
    ${sectionContent}
  );
}
`;
  fs.writeFileSync(path.join(componentsDir, `${name}.tsx`), componentCode);
  console.log(`Overwrote ${name}.tsx`);
}

extractSection('HeroSection', /(<section className="relative w-full overflow-hidden bg-surface-container-lowest -mt-\[72px\][\s\S]*?<\/section>)/);
extractSection('ContinueReadingSection', /(<section className="w-full bg-surface-container-lowest py-space-xl"[\s\S]*?<\/section>)/, 'settings, items');
extractSection('CategorySection', /(<section className="w-full bg-surface-container-lowest py-space-2xl"[\s\S]*?Traverse curated knowledge nodes[\s\S]*?<\/section>)/, 'sectionSettings, categories');
extractSection('FeaturedWikisSection', /(<section className="w-full bg-surface-container-lowest py-space-2xl"[\s\S]*?Curated Vaults of the Month[\s\S]*?<\/section>)/, 'sectionSettings, wikis');
extractSection('TrendingPagesSection', /(<section className="w-full bg-surface-container-lowest py-space-2xl"[\s\S]*?Trending Lore Topics Today[\s\S]*?<\/section>)/, 'settings, pages');
extractSection('CommunitySection', /(<section className="w-full bg-surface-container-lowest py-space-2xl"[\s\S]*?Live Ledger Updates[\s\S]*?<\/section>)/, 'settings, updates');
extractSection('PublishCTASection', /(<section className="w-full bg-surface-container-lowest py-space-2xl"[\s\S]*?Serendipitous Exploration[\s\S]*?<\/section>)/);
