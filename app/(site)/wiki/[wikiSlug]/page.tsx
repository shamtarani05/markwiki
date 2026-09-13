import Link from 'next/link';

export default function Page() {
  return (
    <>
<div className="flex flex-col w-full">
{/*  1. WIKI HERO (Cinematic franchise header with -mt-shell compensation)  */}
<section className="relative w-full -mt-[72px] pt-[72px] h-[580px] flex flex-col justify-end overflow-hidden">
{/*  Atmospheric Visual Layer  */}
<div className="absolute inset-0 w-full h-full bg-cover bg-center" data-alt="Cinematic dark fantasy landscape depicting towering ethereal blue and violet monarch gates radiating intense dark energy over a rain-slicked futuristic Seoul skyline at night. Subtle violet embers drift upwards, cinematic lighting, sharp shadows, hyper-detailed anime illustration in dark violet and obsidian tones." style={{backgroundImage: 'url(\'https'}}></div>
{/*  Multi-stage Scrim Gradients  */}
<div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-surface-container-lowest/40"></div>
<div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/70 to-transparent"></div>
<div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_20%_40%,rgba(160,120,255,0.18),transparent)] pointer-events-none"></div>
{/*  Hero Content Container  */}
<div className="relative z-10 w-full max-w-[1440px] mx-auto px-margin-sm md:px-margin lg:px-margin-lg pb-space-xl flex flex-col justify-end">
{/*  Breadcrumb Bar  */}
<nav className="flex items-center gap-space-xs text-on-surface-variant font-label-mono text-label-mono mb-space-sm">
<Link className="hover:text-primary transition-colors" data-path="home" href="#">Home</Link>
<span className="text-outline-variant">/</span>
<Link className="hover:text-primary transition-colors" data-path="wikis" href="#">Wikis</Link>
<span className="text-outline-variant">/</span>
<Link className="hover:text-primary transition-colors" data-path="anime-webtoons" href="#">Anime &amp; Webtoons</Link>
<span className="text-outline-variant">/</span>
<span className="text-secondary font-semibold">Solo Leveling</span>
</nav>
{/*  Badge Strip  */}
<div className="flex flex-wrap items-center gap-space-xs mb-space-md">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 text-primary font-label-caps text-label-caps uppercase tracking-wider shadow-sm">
<span className="material-symbols-outlined text-xs">verified</span> Official Community Wiki
        </span>
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-container/20 text-tertiary-fixed font-label-caps text-label-caps uppercase tracking-wider">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span> Verified Canon
        </span>
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/50 text-secondary font-label-caps text-label-caps uppercase tracking-wider">
<span className="material-symbols-outlined text-xs" style={{fontVariationSettings: '\'FILL\' 1'}}>local_fire_department</span> Rank #1 Trending
        </span>
</div>
{/*  Identity & Title  */}
<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
<div className="space-y-space-xs max-w-3xl">
<div className="flex items-center gap-space-md">
<div className="w-14 h-14 rounded-xl bg-surface-container-high flex items-center justify-center shadow-xl overflow-hidden shrink-0">
<svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 48 48">
<circle cx="24" cy="11" fill="currentColor" r="3.5" />
<path d="M10 37V19L24 28L38 19V37" />
<path d="M18 24.5L24 33L30 24.5" stroke="#a078ff" strokeWidth="3" />
<line x1="12" x2="36" y1="36" y2="36" />
</svg>
</div>
<div>
<p className="font-label-mono text-label-mono uppercase tracking-widest text-outline">Living Codex · Sovereign Records</p>
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Solo Leveling: Complete Archives</h1>
</div>
</div>
{/*  Metadata Metrics Strip  */}
<div className="flex flex-wrap items-center gap-x-space-md gap-y-1 pt-space-xs text-on-surface-variant font-label-mono text-label-mono">
<span className="flex items-center gap-1 text-on-surface font-semibold"><span className="material-symbols-outlined text-sm text-primary">menu_book</span> 4,892 <span className="font-normal text-on-surface-variant">Articles</span></span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1 text-on-surface font-semibold"><span className="material-symbols-outlined text-sm text-secondary">image</span> 18,420 <span className="font-normal text-on-surface-variant">Media Assets</span></span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1 text-on-surface font-semibold"><span className="material-symbols-outlined text-sm text-tertiary">visibility</span> 1.4M <span className="font-normal text-on-surface-variant">Monthly Readers</span></span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1 text-on-surface font-semibold"><span className="material-symbols-outlined text-sm text-primary">groups</span> 340 <span className="font-normal text-on-surface-variant">Active Contributors</span></span>
</div>
</div>
{/*  Hero Actions  */}
<div className="flex flex-wrap items-center gap-space-xs sm:gap-space-sm shrink-0">
<Link className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-wider shadow-lg hover:bg-primary-fixed hover:text-on-primary-fixed transition-all" href="#featured-pillar">
<span className="material-symbols-outlined text-base">explore</span> Explore Wiki
          </Link>
<button className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container-high text-on-surface font-label-caps text-label-caps uppercase tracking-wider hover:bg-surface-bright transition-all" id="randomBtn">
<span className="material-symbols-outlined text-base">shuffle</span> Random Article
          </button>
<Link className="inline-flex items-center gap-1 px-space-sm py-2.5 rounded-xl bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider hover:text-on-surface hover:bg-surface-container-high transition-all" data-path="create-page" href="#">
<span className="material-symbols-outlined text-base">add</span> Page
          </Link>
<button className="w-10 h-10 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-center hover:text-primary hover:bg-surface-container-high transition-all" id="watchBtn" title="Watch Canon Updates">
<span className="material-symbols-outlined text-lg">notifications</span>
</button>
</div>
</div>
</div>
</section>
{/*  2. WIKI NAVIGATION TABS (Sticky tab bar with horizontal scroll)  */}
<div className="sticky top-[72px] z-40 w-full bg-surface-container-lowest/90 backdrop-blur-xl shadow-md py-2.5">
<div className="max-w-[1440px] mx-auto px-margin-sm md:px-margin lg:px-margin-lg">
<div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap py-1">
<button className="px-space-md py-1.5 rounded-lg bg-primary-container text-on-primary-container font-label-caps text-label-caps uppercase tracking-wider shadow-sm shrink-0">Overview (Active)</button>
<button className="px-space-md py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-caps text-label-caps uppercase tracking-wider shrink-0 transition-colors">Characters &amp; Hunters</button>
<button className="px-space-md py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-caps text-label-caps uppercase tracking-wider shrink-0 transition-colors">Shadow Monarchs</button>
<button className="px-space-md py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-caps text-label-caps uppercase tracking-wider shrink-0 transition-colors">Dungeons &amp; Gates</button>
<button className="px-space-md py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-caps text-label-caps uppercase tracking-wider shrink-0 transition-colors">Webtoon Chapters</button>
<button className="px-space-md py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-caps text-label-caps uppercase tracking-wider shrink-0 transition-colors">Light Novel</button>
<button className="px-space-md py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-caps text-label-caps uppercase tracking-wider shrink-0 transition-colors">Artifacts &amp; Weapons</button>
<button className="px-space-md py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-caps text-label-caps uppercase tracking-wider shrink-0 transition-colors">Community Discussions</button>
</div>
</div>
</div>
{/*  3. THREE-COLUMN EDITORIAL HUB LAYOUT  */}
<main className="w-full max-w-[1440px] mx-auto px-margin-sm md:px-margin lg:px-margin-lg pt-space-xl pb-space-2xl">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
{/*  LEFT COLUMN: 25% (lg:col-span-3) - Wiki Quick Navigation & Lore Index  */}
<aside className="lg:col-span-3 space-y-space-lg">
{/*  Lore Index Card  */}
<div className="bg-surface-container-low rounded-xl p-space-md shadow-sm space-y-space-md">
<div className="flex items-center justify-between pb-space-xs">
<h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-xl">account_tree</span>
              Canon Directory
            </h3>
<span className="font-label-mono text-label-mono text-outline">SEC.01</span>
</div>
{/*  Monarch Hierarchy  */}
<div className="space-y-space-xs">
<div className="flex items-center justify-between text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider py-1">
<span>Monarch Hierarchy</span>
<span className="text-tertiary">9 Primordial</span>
</div>
<ul className="space-y-1 pl-2">
<li>
<Link className="group flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container transition-all" href="#">
<span className="text-body-sm font-body-sm text-on-surface group-hover:text-primary transition-colors truncate">Shadow Monarch (Ashborn / Jinwoo)</span>
<span className="text-outline text-xs material-symbols-outlined group-hover:translate-x-0.5 transition-transform">chevron_right</span>
</Link>
</li>
<li>
<Link className="group flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container transition-all" href="#">
<span className="text-body-sm font-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors truncate">Monarch of Destruction (Antares)</span>
<span className="text-outline text-xs material-symbols-outlined">chevron_right</span>
</Link>
</li>
<li>
<Link className="group flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container transition-all" href="#">
<span className="text-body-sm font-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors truncate">Monarch of White Flames (Baran)</span>
<span className="text-outline text-xs material-symbols-outlined">chevron_right</span>
</Link>
</li>
<li>
<Link className="group flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container transition-all" href="#">
<span className="text-body-sm font-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors truncate">Frost Monarch (Sillad)</span>
<span className="text-outline text-xs material-symbols-outlined">chevron_right</span>
</Link>
</li>
</ul>
</div>
{/*  Hunter Ranks Breakdown  */}
<div className="space-y-space-xs pt-space-xs">
<div className="flex items-center justify-between text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider py-1">
<span>Hunter Classification</span>
<span className="font-label-mono text-label-mono text-outline">KHA System</span>
</div>
<div className="grid grid-cols-6 gap-1 text-center font-label-mono text-label-mono">
<div className="p-2 rounded-lg bg-surface-container-high text-primary font-bold shadow-inner">S</div>
<div className="p-2 rounded-lg bg-surface-container text-on-surface">A</div>
<div className="p-2 rounded-lg bg-surface-container text-on-surface">B</div>
<div className="p-2 rounded-lg bg-surface-container text-on-surface-variant">C</div>
<div className="p-2 rounded-lg bg-surface-container text-on-surface-variant">D</div>
<div className="p-2 rounded-lg bg-surface-container text-outline">E</div>
</div>
</div>
{/*  National Level Hunters  */}
<div className="space-y-space-xs pt-space-xs">
<div className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider py-1">
              National Level Hunters (Special S)
            </div>
<div className="space-y-1.5">
<div className="flex items-center justify-between p-2 rounded-lg bg-surface-container text-body-sm font-body-sm">
<span className="text-on-surface truncate">Thomas Andre (USA)</span>
<span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-xs font-label-mono">Vessel #1</span>
</div>
<div className="flex items-center justify-between p-2 rounded-lg bg-surface-container text-body-sm font-body-sm">
<span className="text-on-surface truncate">Liu Zhigang (China)</span>
<span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-xs font-label-mono">Vessel #2</span>
</div>
<div className="flex items-center justify-between p-2 rounded-lg bg-surface-container text-body-sm font-body-sm">
<span className="text-on-surface truncate">Christopher Reed (USA)</span>
<span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-xs font-label-mono">Vessel #3</span>
</div>
</div>
</div>
{/*  World Gates Timeline Metric  */}
<div className="pt-space-xs space-y-space-xs">
<div className="flex items-center justify-between text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">
<span>World Gate Incident Scale</span>
<span className="text-tertiary font-label-mono text-label-mono">Year 10</span>
</div>
{/*  Progress Bar / Sparkline Mini-Viz  */}
<div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
<div className="bg-gradient-to-r from-primary via-primary-container to-tertiary h-full rounded-full" style={{width: '88%'}}></div>
</div>
<div className="flex justify-between text-xs font-label-mono text-outline pt-1">
<span>First Awakening</span>
<span>Jeju Island Raid</span>
<span>Sovereign War</span>
</div>
</div>
</div>
{/*  Lore Curation Notice  */}
<div className="p-space-md rounded-xl bg-gradient-to-br from-primary-container/20 to-surface-container-low shadow-sm">
<div className="flex items-start gap-space-sm">
<span className="material-symbols-outlined text-primary text-2xl">auto_stories</span>
<div className="space-y-1">
<h4 className="font-headline-sm text-headline-sm text-on-surface">Community Canon Project</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Every hunter, rune stone, and shadow soldier verified against light novel and manhwa texts.</p>
<Link className="inline-flex items-center gap-1 font-label-caps text-label-caps uppercase text-primary hover:text-primary-fixed pt-1" data-path="guidelines" href="#">
                Read Archival Rubric <span className="material-symbols-outlined text-xs">arrow_forward</span>
</Link>
</div>
</div>
</div>
</aside>
{/*  CENTER COLUMN: 50% (lg:col-span-6) - Primary Content & Lore Dissections  */}
<section className="lg:col-span-6 space-y-space-xl">
{/*  FEATURED PILLAR ARTICLE  */}
<article className="bg-surface-container-low rounded-xl overflow-hidden shadow-lg" id="featured-pillar">
{/*  Pillar Media Header  */}
<div className="relative h-72 sm:h-80 w-full overflow-hidden">
<div className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105" data-alt="Solo Leveling Sung Jinwoo standing with glowing blue eyes, wielding glowing dual daggers, surrounded by ethereal shadowy soldiers rising from darkness. Highly detailed anime key visual artwork, dark neon violet and indigo mist aura, high contrast editorial lighting." style={{backgroundImage: 'url(\'https'}}></div>
<div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/40 to-transparent"></div>
<div className="absolute top-space-md left-space-md flex items-center gap-space-xs">
<span className="px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md font-label-caps text-label-caps uppercase tracking-wider text-primary shadow-sm">
                Featured Pillar Article
              </span>
<span className="px-2.5 py-1 rounded-full bg-tertiary-container/30 backdrop-blur-md font-label-mono text-label-mono text-tertiary-fixed">
                CANON ID: #0001
              </span>
</div>
</div>
{/*  Pillar Body Content  */}
<div className="p-space-lg space-y-space-md">
<div className="space-y-1">
<div className="flex items-center gap-2 font-label-mono text-label-mono text-primary">
<span>HUNTER RANK: UNMEASURABLE</span>
<span>•</span>
<span>SHADOW MONARCH</span>
</div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">
                Sung Jinwoo: The Shadow Sovereign
              </h2>
</div>
<p className="font-body-editorial text-body-editorial text-on-surface-variant">
              From the infamous moniker “The Weakest Hunter of All Mankind” to the ultimate arbiter of existence, Sung Jinwoo’s ascension redefines the cosmological balance between the Rulers and the Monarchs. Following the double dungeon trial at the Cartenon Temple, Jinwoo was chosen as the sole human player of the “System.”
            </p>
{/*  Inline Canonical Status & Quick Metrics  */}
<div className="grid grid-cols-3 gap-space-sm py-space-xs">
<div className="p-space-sm rounded-lg bg-surface-container">
<span className="font-label-mono text-xs text-outline block">ARMY SIZE</span>
<span className="font-headline-sm text-headline-sm text-on-surface">130,000+</span>
</div>
<div className="p-space-sm rounded-lg bg-surface-container">
<span className="font-label-mono text-xs text-outline block">KEY WEAPON</span>
<span className="font-headline-sm text-headline-sm text-secondary truncate block">Kamish’s Wrath</span>
</div>
<div className="p-space-sm rounded-lg bg-surface-container">
<span className="font-label-mono text-xs text-outline block">FINAL FORM</span>
<span className="font-headline-sm text-headline-sm text-tertiary truncate block">True Sovereign</span>
</div>
</div>
{/*  Deep-Link Chapter Index  */}
<div className="p-space-md rounded-xl bg-surface-container space-y-space-xs">
<span className="font-label-caps text-label-caps uppercase text-outline tracking-wider block">Deep Lore Chapter Jumps</span>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-body-sm font-body-sm">
<Link className="text-on-surface hover:text-primary transition-colors flex items-center gap-1.5" href="#">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Awakening &amp; System Rules
                </Link>
<Link className="text-on-surface hover:text-primary transition-colors flex items-center gap-1.5" href="#">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Jeju Island Ant Extinction
                </Link>
<Link className="text-on-surface hover:text-primary transition-colors flex items-center gap-1.5" href="#">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Ashborn’s Memory Transmission
                </Link>
<Link className="text-on-surface hover:text-primary transition-colors flex items-center gap-1.5" href="#">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span> The Cup of Reincarnation
                </Link>
</div>
</div>
<div className="flex items-center justify-between pt-space-xs">
<Link className="inline-flex items-center gap-2 font-label-caps text-label-caps uppercase tracking-wider text-primary hover:text-primary-fixed" data-path="read-pillar" href="#">
                Read Full Manuscript (24,500 words) <span className="material-symbols-outlined text-sm">arrow_forward</span>
</Link>
<span className="font-label-mono text-label-mono text-outline">Last revised 4 hours ago by @CodexMaster</span>
</div>
</div>
</article>
{/*  POPULAR CHARACTERS IMAGE-FIRST GRID  */}
<section className="space-y-space-md">
<div className="flex items-center justify-between">
<div>
<h3 className="font-headline-md text-headline-md text-on-surface">Key Persona &amp; Shadows</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Archived profiles with verified power levels and gear matrices.</p>
</div>
<Link className="text-primary hover:text-primary-fixed font-label-caps text-label-caps uppercase tracking-wider" data-path="all-characters" href="#">View All (412)</Link>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
{/*  Card 1: Cha Hae-In  */}
<div className="group relative rounded-xl overflow-hidden bg-surface-container-low shadow-md">
<div className="h-48 w-full overflow-hidden relative">
<div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" data-alt="Cha Hae-In from Solo Leveling, blonde hair with sword stance, glowing golden mana aura, sharp intense expression in high rank combat attire, dark violet atmospheric background, anime character portrait." style={{backgroundImage: 'url(\'https'}}></div>
<div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/30 to-transparent"></div>
<span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-primary/20 backdrop-blur-md text-primary font-label-mono text-xs font-bold">RANK: S</span>
</div>
<div className="p-space-md space-y-1">
<h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">Cha Hae-In</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Vice-Guild Master of Hunters Guild. Renowned for Master of the Sword skill and acute mana olfactory sensitivity.</p>
<div className="flex items-center justify-between pt-2 text-xs font-label-mono text-outline">
<span>HUNTERS GUILD</span>
<span>142 Edits</span>
</div>
</div>
</div>
{/*  Card 2: Igris the Bloodred  */}
<div className="group relative rounded-xl overflow-hidden bg-surface-container-low shadow-md">
<div className="h-48 w-full overflow-hidden relative">
<div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" data-alt="Igris the Bloodred from Solo Leveling, tall knight in blackened crimson plate armor with a long red plume flowing from his winged helmet, wielding a massive broadsword, dark purple glow, anime illustration." style={{backgroundImage: 'url(\'https'}}></div>
<div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/30 to-transparent"></div>
<span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-tertiary-container/30 backdrop-blur-md text-tertiary-fixed font-label-mono text-xs font-bold">MARSHAL GRADE</span>
</div>
<div className="p-space-md space-y-1">
<h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">Igris the Bloodred</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">The loyal former commander of the Empty Throne, resurrected into Jinwoo’s earliest shadow pillar commander.</p>
<div className="flex items-center justify-between pt-2 text-xs font-label-mono text-outline">
<span>SHADOW ARMY</span>
<span>98 Edits</span>
</div>
</div>
</div>
{/*  Card 3: Sung Il-Hwan  */}
<div className="group relative rounded-xl overflow-hidden bg-surface-container-low shadow-md">
<div className="h-48 w-full overflow-hidden relative">
<div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" data-alt="Sung Il-Hwan from Solo Leveling, bearded hardened hunter with luminous golden eyes radiating divine energy of the Rulers, trenchcoat in wind, dramatic dark background, high detail anime artwork." style={{backgroundImage: 'url(\'https'}}></div>
<div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/30 to-transparent"></div>
<span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-surface-container-high/80 backdrop-blur-md text-secondary font-label-mono text-xs font-bold">RULER’S VESSEL</span>
</div>
<div className="p-space-md space-y-1">
<h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">Sung Il-Hwan</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Jinwoo’s father, trapped in a dimensional dungeon for a decade and returned as the emissary of the Rulers.</p>
<div className="flex items-center justify-between pt-2 text-xs font-label-mono text-outline">
<span>RULERS' ENVOY</span>
<span>76 Edits</span>
</div>
</div>
</div>
{/*  Card 4: Thomas Andre  */}
<div className="group relative rounded-xl overflow-hidden bg-surface-container-low shadow-md">
<div className="h-48 w-full overflow-hidden relative">
<div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" data-alt="Thomas Andre the Goliath from Solo Leveling, massive muscular build, blonde hair, dark sunglasses, glowing golden runic tattoos covering his arms and torso, dark purple atmosphere, anime styling." style={{backgroundImage: 'url(\'https'}}></div>
<div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/30 to-transparent"></div>
<span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-primary-container/30 backdrop-blur-md text-primary font-label-mono text-xs font-bold">NATIONAL LEVEL</span>
</div>
<div className="p-space-md space-y-1">
<h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">Thomas Andre</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">“The Goliath” of the Scavenger Guild. Master of telekinesis capture and raw physical fortification.</p>
<div className="flex items-center justify-between pt-2 text-xs font-label-mono text-outline">
<span>SCAVENGER GUILD</span>
<span>115 Edits</span>
</div>
</div>
</div>
</div>
</section>
{/*  LATEST LORE UPDATES & CHAPTER DISSECTIONS  */}
<section className="space-y-space-md">
<div className="flex items-center justify-between">
<h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
<span className="material-symbols-outlined text-primary">history_edu</span>
              Latest Lore Updates &amp; Dissections
            </h3>
<span className="font-label-mono text-label-mono text-tertiary flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span> SYNCED REALTIME
            </span>
</div>
<div className="space-y-space-xs">
{/*  Lore Item 1  */}
<div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm shadow-sm">
<div className="space-y-1 max-w-xl">
<div className="flex items-center gap-2">
<span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-label-mono text-xs">DIFF +1,840 WORDS</span>
<span className="text-outline text-xs font-label-mono">Chapter 179 - Epilogue Analysis</span>
</div>
<h4 className="font-headline-sm text-headline-sm text-on-surface">Dimensional Rift Timeline Reconciliation</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Updated cross-referencing between the side stories (Ragnarok prequel) and the webtoon canon continuity.</p>
</div>
<div className="flex sm:flex-col items-end justify-between sm:justify-center text-xs font-label-mono text-outline shrink-0">
<span className="text-on-surface font-semibold">@ShadowScholar</span>
<span>12m ago</span>
</div>
</div>
{/*  Lore Item 2  */}
<div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm shadow-sm">
<div className="space-y-1 max-w-xl">
<div className="flex items-center gap-2">
<span className="px-2 py-0.5 rounded bg-tertiary-container/30 text-tertiary font-label-mono text-xs">DIFF +620 WORDS</span>
<span className="text-outline text-xs font-label-mono">Artifact Catalog</span>
</div>
<h4 className="font-headline-sm text-headline-sm text-on-surface">Demon King&apos;s Longsword Stat Formula Added</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Confirmed damage scaling mechanics based on Baran&apos;s lightning enchantment specifications.</p>
</div>
<div className="flex sm:flex-col items-end justify-between sm:justify-center text-xs font-label-mono text-outline shrink-0">
<span className="text-on-surface font-semibold">@AriseArchivist</span>
<span>1h ago</span>
</div>
</div>
{/*  Lore Item 3  */}
<div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm shadow-sm">
<div className="space-y-1 max-w-xl">
<div className="flex items-center gap-2">
<span className="px-2 py-0.5 rounded bg-secondary-container/40 text-secondary font-label-mono text-xs">MEDIA +14 PINS</span>
<span className="text-outline text-xs font-label-mono">Anime S2 Production</span>
</div>
<h4 className="font-headline-sm text-headline-sm text-on-surface">A-1 Pictures Episode 14 Layout Visuals</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Archived official keyframe drawings depicting the Demon Castle 75th floor encounter.</p>
</div>
<div className="flex sm:flex-col items-end justify-between sm:justify-center text-xs font-label-mono text-outline shrink-0">
<span className="text-on-surface font-semibold">@KHA_Director</span>
<span>3h ago</span>
</div>
</div>
</div>
</section>
</section>
{/*  RIGHT COLUMN: 25% (lg:col-span-3) - Infobox, Realtime Contributors & Trending  */}
<aside className="lg:col-span-3 space-y-space-lg">
{/*  Franchise Fast Facts Infobox  */}
<div className="bg-surface-container-low rounded-xl p-space-md shadow-sm space-y-space-md">
<div className="flex items-center justify-between pb-space-xs">
<h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-xl">dataset</span>
              Franchise Index
            </h3>
<span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-label-mono text-xs font-semibold">CANON INFOBOX</span>
</div>
<div className="space-y-space-xs text-body-sm font-body-sm">
<div className="flex flex-col py-1">
<span className="font-label-caps text-label-caps uppercase text-outline">Original Author</span>
<span className="text-on-surface font-medium">Chugong (추공)</span>
</div>
<div className="flex flex-col py-1">
<span className="font-label-caps text-label-caps uppercase text-outline">Illustrator (Webtoon)</span>
<span className="text-on-surface font-medium">DUBU (REDICE STUDIO) †</span>
</div>
<div className="flex flex-col py-1">
<span className="font-label-caps text-label-caps uppercase text-outline">English Publisher</span>
<span className="text-on-surface font-medium">Yen Press / Tappytoon</span>
</div>
<div className="flex flex-col py-1">
<span className="font-label-caps text-label-caps uppercase text-outline">First Serialization</span>
<span className="text-on-surface font-medium">July 25, 2016 (Novel) · 2018 (Manhwa)</span>
</div>
<div className="flex flex-col py-1">
<span className="font-label-caps text-label-caps uppercase text-outline">Current Status</span>
<span className="text-tertiary font-medium">Completed (Main Canon: 179 Ch.)</span>
</div>
<div className="flex flex-col py-1">
<span className="font-label-caps text-label-caps uppercase text-outline">Sequel / Spin-off</span>
<span className="text-secondary font-medium">Solo Leveling: Ragnarok</span>
</div>
<div className="flex flex-col py-1">
<span className="font-label-caps text-label-caps uppercase text-outline">Adaptations</span>
<span className="text-on-surface font-medium">Anime Season 2 (A-1 Pictures) · Netmarble Action RPG</span>
</div>
</div>
</div>
{/*  Live Community Contributors Working Now  */}
<div className="bg-surface-container-low rounded-xl p-space-md shadow-sm space-y-space-md">
<div className="flex items-center justify-between">
<h4 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
<span className="material-symbols-outlined text-tertiary text-xl">edit_note</span>
              Live Collaborators
            </h4>
<span className="font-label-mono text-label-mono text-tertiary flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span> 18 Active
            </span>
</div>
<div className="space-y-space-xs">
<div className="flex items-center gap-space-sm p-2 rounded-lg bg-surface-container">
<img alt="User Avatar" className="w-8 h-8 rounded-full object-cover shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARJErOkKFlQl7Mef4kA92TOv9zfiG8EPWiOwAQR0cx5elr-jINIaoyePvZwfxbnA2DvqudoR6_pMV4hA0dBrkR87hr1n8amvZ4_WjmGbD5FCic6PanoNtWBXP9Nv7YSB2id_GZgxuE1rsIxQ7iO-vzhwHVEhvugPs125EyM6p3iSoLLqWY1fHGSr2BtrGpx-mHIsLnuQbKu5Hi3EN2vs5bcgI4Ij_fyQEz8X58FGYz1g6TRIRcw1G27Q"/>
<div className="min-w-0 flex-1">
<p className="text-body-sm font-body-sm text-on-surface font-medium truncate">AuraWeaver</p>
<p className="text-xs font-label-mono text-outline truncate">Editing: Demon Castle Runes</p>
</div>
<span className="text-xs font-label-mono text-primary font-bold">L9</span>
</div>
<div className="flex items-center gap-space-sm p-2 rounded-lg bg-surface-container">
<div className="w-8 h-8 rounded-full bg-secondary-container text-secondary flex items-center justify-center font-bold text-xs shrink-0">
                SL
              </div>
<div className="min-w-0 flex-1">
<p className="text-body-sm font-body-sm text-on-surface font-medium truncate">ShadowLore99</p>
<p className="text-xs font-label-mono text-outline truncate">Auditing: Bellion Entry</p>
</div>
<span className="text-xs font-label-mono text-tertiary font-bold">L12</span>
</div>
<div className="flex items-center gap-space-sm p-2 rounded-lg bg-surface-container">
<div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs shrink-0">
                KR
              </div>
<div className="min-w-0 flex-1">
<p className="text-body-sm font-body-sm text-on-surface font-medium truncate">K-RaidLead</p>
<p className="text-xs font-label-mono text-outline truncate">Reviewing: Red Gate Citations</p>
</div>
<span className="text-xs font-label-mono text-secondary font-bold">L7</span>
</div>
</div>
<Link className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-caps text-label-caps uppercase tracking-wider transition-colors" data-path="contribute" href="#">
            Join Archival Queue
          </Link>
</div>
{/*  Trending Searches in this Franchise  */}
<div className="bg-surface-container-low rounded-xl p-space-md shadow-sm space-y-space-md">
<h4 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-xl">trending_up</span>
            Trending Searches
          </h4>
<div className="flex flex-wrap gap-1.5">
<Link className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-label-mono text-on-surface-variant hover:text-primary transition-all" href="#">#Beru</Link>
<Link className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-label-mono text-on-surface-variant hover:text-primary transition-all" href="#">#RulersCup</Link>
<Link className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-label-mono text-on-surface-variant hover:text-primary transition-all" href="#">#DoubleDungeonStatue</Link>
<Link className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-label-mono text-on-surface-variant hover:text-primary transition-all" href="#">#DemonBaran</Link>
<Link className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-label-mono text-on-surface-variant hover:text-primary transition-all" href="#">#AhjinGuild</Link>
<Link className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-label-mono text-on-surface-variant hover:text-primary transition-all" href="#">#AshbornOrigin</Link>
</div>
</div>
</aside>
</div>
</main>
</div>
    </>
  );
}
