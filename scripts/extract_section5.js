const fs = require('fs');
const path = require('path');
const content = fs.readFileSync('D:/FreeLancing_Projects/markwiki/app/(site)/page.tsx', 'utf-8');
const parts = content.split(/\{\/\*  ================= 5\. COMMUNITY ACTIVITY.*?=================  \*\/\}/);
let sectionContent = parts[1].split(/\{\/\*  =================/)[0];
sectionContent = sectionContent.replace(/<\/div>\s*<\/>\s*\}\s*$/g, '');
const componentCode = `import Link from 'next/link';
import type { HomepageSectionSettings } from '@/src/lib/db/homepageSections';

export default function RecentActivitySection({ settings }: { settings?: HomepageSectionSettings | any }) {
  return (
    ${sectionContent.trim()}
  );
}
`;
fs.writeFileSync('D:/FreeLancing_Projects/markwiki/src/components/home/RecentActivitySection.tsx', componentCode);
console.log('Successfully extracted RecentActivitySection.tsx');
