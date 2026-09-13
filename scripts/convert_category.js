const fs = require('fs');
let content = fs.readFileSync('d:/FreeLancing_Projects/markwiki/scratch_category.html', 'utf-8');

content = content.replace(/\bclass=/g, 'className=');
content = content.replace(/(<(img|input|br|hr|path|rect|circle)[^>]*?)(?<!\/)>/g, '$1 />');

content = content.replace(/style="([^"]*)"/g, (match, p1) => {
    let styles = [];
    for (let prop of p1.split(';')) {
        if (!prop.trim() || !prop.includes(':')) continue;
        let [k, v] = prop.split(':');
        k = k.trim(); v = v.trim();
        let parts = k.split('-');
        let kCamel = parts[0] + parts.slice(1).map(x => x.charAt(0).toUpperCase() + x.slice(1)).join('');
        v = v.replace(/'/g, "\\'");
        styles.push(`${kCamel}: '${v}'`);
    }
    return 'style={{' + styles.join(', ') + '}}';
});

content = content.replace(/stroke-width/g, 'strokeWidth');
content = content.replace(/stroke-linecap/g, 'strokeLinecap');
content = content.replace(/stroke-linejoin/g, 'strokeLinejoin');
content = content.replace(/viewbox/g, 'viewBox');
content = content.replace(/fill-rule/g, 'fillRule');
content = content.replace(/clip-rule/g, 'clipRule');

content = content.replace(/<!--(.*?)-->/g, '{/* $1 */}');
content = content.replace(/([a-zA-Z])'([a-zA-Z])/g, "$1&apos;$2");

let output = `// @ts-nocheck
import Link from 'next/link';
import type { HomepageSectionSettings } from '@/src/lib/db/homepageSections';

export default function CategorySection({ sectionSettings }: { sectionSettings?: HomepageSectionSettings | any }) {
  return (
` + content + `
  );
}
`;

fs.writeFileSync('d:/FreeLancing_Projects/markwiki/src/components/home/CategorySection.tsx', output);
console.log('Done converting CategorySection');
