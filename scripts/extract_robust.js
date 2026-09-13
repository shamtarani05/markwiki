const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../app/(site)/page.tsx');
const content = fs.readFileSync(pagePath, 'utf-8');

const componentsDir = path.join(__dirname, '../src/components/home');

// Extract by finding the comment, and then grabbing everything until the NEXT comment or the end of the file/div.
function extractByComment(name, commentPrefix, settingsProp = 'settings') {
  const parts = content.split(new RegExp('\\{\\/\\*  ================= ' + commentPrefix + '.*=================  \\*\\/\\}'));
  if (parts.length < 2) {
    console.error(`Could not find section for ${name}`);
    return;
  }
  
  // The content of the section is in parts[1]. We need to stop at the next `{/*  =================`
  let sectionContent = parts[1].split(/\{\/\*  =================/)[0];
  
  // Remove the trailing `</div>` and `</>` if it's the last section
  sectionContent = sectionContent.replace(/<\/div>\s*<\/>\s*\}\s*$/g, '');

  const componentCode = `import Link from 'next/link';
import type { HomepageSectionSettings } from '@/src/lib/db/homepageSections';

export default function ${name}({ ${settingsProp} }: { ${settingsProp}?: HomepageSectionSettings | any }) {
  return (
    ${sectionContent.trim()}
  );
}
`;
  fs.writeFileSync(path.join(componentsDir, `${name}.tsx`), componentCode);
  console.log(`Successfully extracted and overwrote ${name}.tsx`);
}

extractByComment('HeroSection', '1\\. CINEMATIC HERO');
extractByComment('ContinueReadingSection', '2\\. CONTINUE READING TRAY', 'settings, items');
extractByComment('CategorySection', '3\\. CATEGORY EXPLORER', 'sectionSettings, categories');
extractByComment('FeaturedWikisSection', '3\\. FEATURED WIKIS', 'sectionSettings, wikis');
extractByComment('TrendingPagesSection', '4\\. TRENDING NOW', 'settings, pages');
extractByComment('CommunitySection', '5\\. LIVE LEDGER UPDATES', 'settings, updates');
extractByComment('PublishCTASection', '6\\. RANDOM DISCOVERY');
