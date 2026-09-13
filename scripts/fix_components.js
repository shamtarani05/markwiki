const fs = require('fs');

let c = fs.readFileSync('src/components/home/CategorySection.tsx', 'utf-8');
c = c.replace('Explore Hubs & Categories', '{sectionSettings?.title || "Explore Hubs & Categories"}');
c = c.replace('Find the communities actively curating the knowledge you seek.', '{sectionSettings?.subtitle || "Find the communities actively curating the knowledge you seek."}');
fs.writeFileSync('src/components/home/CategorySection.tsx', c);

c = fs.readFileSync('src/components/home/HeroSection.tsx', 'utf-8');
c = c.replace('Explore the worlds <span className="italic font-normal text-primary">you love.</span>', '{settings?.heroTitle ? <span dangerouslySetInnerHTML={{__html: settings.heroTitle.replace(/<accent>/g, \\'<span class="italic font-normal text-primary">\\').replace(/<\\/accent>/g, \\'</span>\\')}} /> : <>Explore the worlds <span className="italic font-normal text-primary">you love.</span></>}');
c = c.replace('The next-generation fan knowledge and serialized fiction platform. Deep lore, verified timelines, and living stories curated by enthusiasts worldwide.', '{settings?.heroSubtitle || "The next-generation fan knowledge and serialized fiction platform. Deep lore, verified timelines, and living stories curated by enthusiasts worldwide."}');
fs.writeFileSync('src/components/home/HeroSection.tsx', c);

c = fs.readFileSync('src/components/home/FeaturedWikisSection.tsx', 'utf-8');
c = c.replace('Spotlight: Featured Wikis', '{sectionSettings?.title || "Spotlight: Featured Wikis"}');
c = c.replace('The most active and comprehensive living archives curated by our community.', '{sectionSettings?.subtitle || "The most active and comprehensive living archives curated by our community."}');
fs.writeFileSync('src/components/home/FeaturedWikisSection.tsx', c);

c = fs.readFileSync('src/components/home/ContinueReadingSection.tsx', 'utf-8');
c = c.replace('Jump Back In', '{settings?.title || "Jump Back In"}');
fs.writeFileSync('src/components/home/ContinueReadingSection.tsx', c);

c = fs.readFileSync('src/components/home/RecentActivitySection.tsx', 'utf-8');
c = c.replace('The Living Record', '{settings?.title || "The Living Record"}');
c = c.replace('Real-time updates across the platform\\'s most active archives.', '{settings?.subtitle || "Real-time updates across the platform\\'s most active archives."}');
fs.writeFileSync('src/components/home/RecentActivitySection.tsx', c);

c = fs.readFileSync('src/components/home/PublishCTASection.tsx', 'utf-8');
c = c.replace('Ready to Start Your Own Archive?', '{settings?.title || "Ready to Start Your Own Archive?"}');
c = c.replace('Start Writing Today', '{settings?.ctaPrimaryText || "Start Writing Today"}');
c = c.replace('Join 14,000+ Lore-Masters', '{settings?.ctaSecondaryText || "Join 14,000+ Lore-Masters"}');
fs.writeFileSync('src/components/home/PublishCTASection.tsx', c);

console.log('Done');
