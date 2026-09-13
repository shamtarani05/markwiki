import Link from 'next/link';

export default function Page() {
  return (
    <>
<div className="flex flex-col w-full relative">
{/*  Scroll Reading Progress Bar  */}
<div className="fixed top-[72px] left-0 right-0 h-1 bg-surface-container-high z-40">
<div className="h-full bg-primary transition-all duration-150 ease-out" id="read-progress-bar" style={{width: '35%'}}></div>
</div>
{/*  Distraction-Free Sticky Secondary Reader Chrome  */}
<header className="sticky top-[73px] z-30 w-full bg-surface-container-lowest/90 backdrop-blur-md px-margin-sm md:px-margin shadow-sm transition-all duration-300">
<div className="max-w-[1440px] mx-auto py-space-xs flex items-center justify-between gap-space-md">
{/*  Left: Back Navigation & Book / Chapter Title  */}
<div className="flex items-center gap-space-sm min-w-0">
<Link className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-lg bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-label-mono font-label-mono uppercase transition-colors shrink-0" data-path="wikis" href="#">
<span className="material-symbols-outlined text-[16px]">arrow_back</span>
<span className="hidden sm:inline">Index</span>
</Link>
<div className="h-4 w-px bg-surface-container-high"></div>
<div className="flex flex-col min-w-0">
<div className="flex items-center gap-2">
<span className="text-label-caps font-label-caps text-primary tracking-widest uppercase truncate">The Shadow Chronicles: Book I</span>
<span className="hidden lg:inline text-outline text-label-mono font-label-mono">·</span>
<span className="hidden lg:inline text-label-mono font-label-mono text-on-surface-variant">Ch. 14 of 48</span>
</div>
<span className="text-headline-sm font-headline-sm text-on-surface truncate text-sm sm:text-base">The Threshold of Ash</span>
</div>
</div>
{/*  Right: Customizer Trigger & Quick Progress Pill  */}
<div className="flex items-center gap-space-xs shrink-0">
<div className="hidden md:flex items-center gap-2 px-space-sm py-1 rounded-full bg-surface-container-low text-label-mono font-label-mono text-tertiary">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
<span id="reading-percentage-label">35% READ</span>
</div>
<button className="inline-flex items-center gap-1.5 px-space-sm py-1.5 rounded-xl bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface text-body-sm font-body-sm transition-colors shadow-sm" id="customizer-toggle-btn">
<span className="material-symbols-outlined text-[18px] text-primary">tune</span>
<span className="font-label-caps text-label-caps uppercase">Format</span>
</button>
<button className="p-1.5 rounded-xl bg-surface-container-high/40 hover:bg-surface-container-highest text-on-surface-variant hover:text-primary transition-colors" id="bookmark-btn" title="Bookmark Chapter">
<span className="material-symbols-outlined text-[20px]">bookmark</span>
</button>
</div>
</div>
{/*  Reading Settings Dropdown / Drawer Modal  */}
<div className="hidden max-w-[1440px] mx-auto pb-space-sm pt-space-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm" id="customizer-panel">
{/*  Type Size  */}
<div className="p-space-sm rounded-xl bg-surface-container-low shadow-inner flex flex-col gap-1.5">
<span className="text-label-caps font-label-caps text-outline uppercase tracking-wider">Font Size</span>
<div className="flex items-center justify-between bg-surface-container-highest rounded-lg p-1">
<button className="w-8 h-7 flex items-center justify-center text-body-sm font-body-sm font-bold text-on-surface hover:text-primary rounded hover:bg-surface-container" id="font-decrease">A−</button>
<span className="text-label-mono font-label-mono text-on-surface" id="font-size-indicator">19px</span>
<button className="w-8 h-7 flex items-center justify-center text-headline-sm font-headline-sm font-bold text-on-surface hover:text-primary rounded hover:bg-surface-container" id="font-increase">A+</button>
</div>
</div>
{/*  Canvas Width  */}
<div className="p-space-sm rounded-xl bg-surface-container-low shadow-inner flex flex-col gap-1.5">
<span className="text-label-caps font-label-caps text-outline uppercase tracking-wider">Reading Width</span>
<div className="grid grid-cols-3 gap-1 bg-surface-container-highest p-1 rounded-lg">
<button className="width-opt py-1 text-label-mono font-label-mono rounded text-center text-on-surface-variant hover:text-on-surface" data-width="narrow">640px</button>
<button className="width-opt py-1 text-label-mono font-label-mono rounded text-center bg-primary-container text-on-primary-container font-semibold shadow-sm" data-width="standard">740px</button>
<button className="width-opt py-1 text-label-mono font-label-mono rounded text-center text-on-surface-variant hover:text-on-surface" data-width="wide">860px</button>
</div>
</div>
{/*  Typography Family  */}
<div className="p-space-sm rounded-xl bg-surface-container-low shadow-inner flex flex-col gap-1.5">
<span className="text-label-caps font-label-caps text-outline uppercase tracking-wider">Typeface</span>
<div className="grid grid-cols-2 gap-1 bg-surface-container-highest p-1 rounded-lg">
<button className="py-1 text-label-mono font-label-mono rounded text-center bg-surface-container text-primary font-medium" id="type-newsreader">Editorial Serif</button>
<button className="py-1 text-label-mono font-label-mono rounded text-center text-on-surface-variant hover:text-on-surface" id="type-geist">Modern Sans</button>
</div>
</div>
{/*  Ambient Atmosphere Scheme  */}
<div className="p-space-sm rounded-xl bg-surface-container-low shadow-inner flex flex-col gap-1.5">
<span className="text-label-caps font-label-caps text-outline uppercase tracking-wider">Theme Tone</span>
<div className="grid grid-cols-4 gap-1.5 pt-0.5">
<button className="theme-opt h-7 rounded-lg bg-surface-container-lowest ring-2 ring-primary flex items-center justify-center text-[10px] text-primary uppercase font-label-mono" data-theme="obsidian" title="Obsidian Dark">Obsidian</button>
<button className="theme-opt h-7 rounded-lg bg-surface-container-high flex items-center justify-center text-[10px] text-on-surface-variant uppercase font-label-mono hover:text-on-surface" data-theme="midnight" title="Midnight Deep">M/Night</button>
<button className="theme-opt h-7 rounded-lg bg-[#2b241c] text-[#d6c7b2] flex items-center justify-center text-[10px] uppercase font-label-mono" data-theme="sepia" title="Warm Sepia">Sepia</button>
<button className="theme-opt h-7 rounded-lg bg-surface-bright text-surface-container-lowest flex items-center justify-center text-[10px] font-bold uppercase font-label-mono" data-theme="minimal" title="High Contrast">Light</button>
</div>
</div>
</div>
</header>
{/*  Ambient Light Backdrops (Contained)  */}
<div className="relative w-full overflow-hidden pointer-events-none">
<div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-primary/5 rounded-full blur-[140px]"></div>
<div className="absolute top-[1200px] -left-20 w-[420px] h-[420px] bg-secondary-container/10 rounded-full blur-[120px]"></div>
<div className="absolute top-[2400px] -right-20 w-[500px] h-[500px] bg-tertiary-container/10 rounded-full blur-[150px]"></div>
</div>
{/*  Primary Reading Column  */}
<main className="w-full px-margin-sm md:px-margin relative z-10 py-space-xl">
<article className="max-w-[740px] mx-auto transition-all duration-300" id="reading-canvas">
{/*  Serial Taxonomy & Volume Header  */}
<section className="mb-space-2xl space-y-space-md">
<div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-sm text-outline font-label-mono text-label-mono">
<div className="flex items-center gap-2">
<span className="px-2 py-0.5 rounded bg-primary/10 text-primary uppercase font-semibold">Canon Arc // 03</span>
<span>·</span>
<span>Aethelgard Reaches</span>
</div>
<div className="flex items-center gap-4 text-on-surface-variant">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> 14 min read</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">menu_book</span> 3,420 words</span>
</div>
</div>
{/*  Hero Chapter Title (NEWSREADER EDITORIAL)  */}
<div className="space-y-space-xs">
<p className="font-headline-md text-headline-md text-primary tracking-tight">Chapter Fourteen</p>
<h1 className="font-display-lg text-display-lg text-on-surface font-normal leading-tight tracking-tight" id="chapter-title">
            The Threshold of Ash
          </h1>
</div>
{/*  Author & Serial Meta Strip  */}
<div className="flex flex-wrap items-center justify-between gap-space-md p-space-md rounded-2xl bg-surface-container-low shadow-sm">
<div className="flex items-center gap-space-sm">
<img className="w-11 h-11 rounded-full object-cover shadow-sm" data-alt="Intense portrait of author Marcus Vance wearing dark intellectual wool coat, subtle violet studio lighting, moody atmospheric background, photorealistic, cinematic key light." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCy62mOPQPVgogAmrshYXR5CFU8JIPASDdHfRBmsSIGRJhNIEj772PoMWgpo2J_2AJimYVoK1-bCQJ_sVHPAH80z7i9h1GIs_q0QPsCwyjlz2n-uRL91KkRBrDKT4OjijMKq3qlDfmET5V9ORGk0mb0PjLOOL5wOw7ZOO9LvDyf6mVjv2JZGkjQm40KIwRZrSEkiMNoUPyH-jTNEpNEKkC_9tRfbY7hj3nFcsBP9aPJHMaCaDWo8GXC3g"/>
<div className="flex flex-col">
<div className="flex items-center gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface text-base">Marcus Vance</span>
<span className="material-symbols-outlined text-primary text-[18px]" style={{fontVariationSettings: '\'FILL\' 1'}} title="Verified Canon Creator">verified</span>
</div>
<span className="font-label-mono text-label-mono text-on-surface-variant">Updated May 18, 2025 · Verified Canon Revision 2.4</span>
</div>
</div>
<div className="flex items-center gap-2">
<button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-body-sm font-body-sm transition-colors">
<span className="material-symbols-outlined text-[18px]">volume_up</span>
<span className="hidden sm:inline">Listen</span>
</button>
<button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-all text-body-sm font-body-sm font-medium shadow-sm">
<span className="material-symbols-outlined text-[18px]">favorite</span>
<span>2.4k</span>
</button>
</div>
</div>
{/*  Atmospheric Chapter Artwork Divider  */}
<div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-xl mt-space-lg group">
<div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" data-alt="Cinematic fantasy illustration of an immense basalt gateway glowing with faint lilac runes under a sky of falling grey embers and purple lightning, dark fantasy mood, obsidian architecture, epic scale, highly detailed concept art." style={{backgroundImage: 'url(\'https'}}></div>
<div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent"></div>
<div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-label-mono font-label-mono text-on-surface-variant text-xs">
<span className="bg-surface-container-lowest/70 backdrop-blur px-2.5 py-1 rounded">Archival Plate 14.1 // The Gates of Vael</span>
<span className="hidden sm:inline bg-surface-container-lowest/70 backdrop-blur px-2.5 py-1 rounded">Spatial Coordinates: Sector 09-Oblivion</span>
</div>
</div>
</section>
{/*  PROSE CONTAINER WITH FAN REACTIONS GHOSTING  */}
<section className="space-y-space-lg text-on-surface text-[19px] leading-[1.8] font-display-lg-mobile transition-all" id="prose-content">
{/*  Opening Paragraph with Drop Cap  */}
<div className="relative group/line">
<p className="text-on-surface">
<span className="float-left text-display-xl font-display-xl leading-[0.75] pr-3 pt-1 text-primary select-none font-normal">T</span>he frost arrived not with the bite of winter, but as a pale, odorless smoke curling between the basalt flagstones. Vaelen adjusted the seal of his mantle, feeling the faint humming pulse of the core beneath his breastplate. Twelve leagues behind them, the Spire of Geryon was burning; its collapsed spire threw long, trembling shards of violet shadow straight across the salt-flats.
          </p>
{/*  In-paragraph fan reaction badge  */}
<div className="absolute -right-3 sm:-right-14 top-1 hidden md:flex items-center opacity-40 hover:opacity-100 transition-opacity">
<button className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-surface-container-high hover:bg-primary-container hover:text-on-primary-container text-label-mono font-label-mono text-primary text-[10px] shadow-sm">
<span className="material-symbols-outlined text-[13px]">mode_comment</span>
<span>18</span>
</button>
</div>
</div>
<p>
          "The beacon didn&apos;t fail," Seraphine murmured, her eyes reflecting the sullen heat of the distant ruin. She knelt near the boundary marker, tracing the cold glass inlaid within the granite. "Someone deliberately starved its furnace. This ash smells of sulfur and crushed celestine—the liturgical alchemy of the Inquisitors."
        </p>
<p>
          Vaelen did not answer immediately. He unsheathed the fractured iron blade, observing the silver filament running down its spine. At forty paces from the chasm, the blade should have shuddered with harmonic resonance. Today, it stayed dead, quiet as petrified wood.
        </p>
{/*  Inline Editorial Quote Break  */}
<aside className="my-space-xl p-space-lg rounded-2xl bg-surface-container-low shadow-md relative overflow-hidden">
<div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
<p className="font-headline-lg font-headline-lg text-headline-sm sm:text-headline-md italic text-primary leading-snug">
            “When the third sigil fractures, do not run toward the light. Light is simply fire searching for something fresh to consume.”
          </p>
<div className="mt-space-sm flex items-center justify-between text-label-mono font-label-mono text-outline text-xs">
<span>— The Litany of Ash, Verse IX</span>
<span className="text-primary hover:underline cursor-pointer">View MarcWiki Canon Codex ↗</span>
</div>
</aside>
{/*  Dynamic High-Impact Dialogue  */}
<div className="relative group/line">
<p>
            "If they hold the crossing," Seraphine continued, rising to her feet and dusting the coarse grit from her fingers, "then Master Kaelen is already behind the cordon. He won&apos;t wait for our confirmation. He&apos;ll detonate the aquifer and flood the entire lower vault."
          </p>
<div className="absolute -right-3 sm:-right-14 top-1 hidden md:flex items-center opacity-40 hover:opacity-100 transition-opacity">
<button className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-surface-container-high hover:bg-primary-container hover:text-on-primary-container text-label-mono font-label-mono text-primary text-[10px] shadow-sm">
<span className="material-symbols-outlined text-[13px]">mode_comment</span>
<span>42</span>
</button>
</div>
</div>
<p>
          "Then we do not use the crossing," Vaelen said. His voice was steady, stripped of whatever panic had gripped him during the siege. He glanced up at the jagged lip of the Obsidian Caldera. The updraft carried flakes of incandescent cinders that dissolved before touching skin. "There is a courier shaft beneath the smelting kiln. The old cartography recorded it as collapsed during the Second Cataclysm, but the structural foundations were built on adamantine ribs."
        </p>
<p>
          She looked at him with an expression suspended between horror and grudging reverence. "The air down there will ignite the moment your core flares."
        </p>
<p>
          "Then I suggest," he replied, lifting his lantern to guide their boots into the yawning fissure, "we learn to move without breathing."
        </p>
{/*  Inline Visual Breakpoint / Artifact Plate  */}
<div className="my-space-xl rounded-2xl bg-surface-container-low p-space-md shadow-sm">
<div className="flex flex-col sm:flex-row items-center gap-space-md">
<div className="w-full sm:w-44 h-36 rounded-xl overflow-hidden shrink-0 shadow-inner">
<img className="w-full h-full object-cover" data-alt="Intricate parchment blueprint of an ancient subterranean dwarven courier shaft and tunnels, glowing purple ink notations, dark fantasy cartography, archival artifact illustration." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiaCYEy1NitTtCFxGYY_iByfeva49IkG_y3aWIf4IppgCsjpezOseBo2h5XqMmuyHI-uhnjWA-LTkPsDx37A3H7pJBGSNX1X1HP5hnoN2Zmpu1ciPR_aBBwGkFBe1mMWymtZxBUKkhJrlElvilFtc5BOD_DjAK8PUu3XJGL9ZRJY3YXtD9AtMEAumuSCf6r6mCRJg6m_4EjFaLuZiSKEZBpCVlcn8pwd6ZPLot99hQ3BPIRM4I00vlhw"/>
</div>
<div className="space-y-1.5">
<div className="flex items-center gap-2">
<span className="text-label-caps font-label-caps text-tertiary uppercase">Interactive Lore Node</span>
<span className="text-outline text-xs">· Node #491</span>
</div>
<h4 className="font-headline-sm text-headline-sm text-on-surface text-base">The Kiln Siphon (Smelter Run)</h4>
<p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                Carved during the 11th Sun Dynasty to siphon subterranean heat directly to the royal forge-works. Canon status: Unsealed by Chapter 14 actions.
              </p>
<Link className="inline-flex items-center gap-1 text-primary text-label-mono font-label-mono text-xs hover:underline pt-1" data-path="wikis" href="#">
<span>Read Full Wiki Entry</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</Link>
</div>
</div>
</div>
<p>
          They descended into the throat of the earth. The air immediately thickened, heavy with the metallic tang of molten copper and the deep, seismic groan of shifting strata. Above them, the stars of the Aethelgard hemisphere were blotted out one by one as the storm-front closed its iron jaws.
        </p>
{/*  Chapter Final Line with End Mark  */}
<div className="pt-space-md text-center">
<p className="italic text-on-surface-variant font-display-lg text-lg">
            And somewhere in the dark below, the clockwork heart of the first ruin began to beat again.
          </p>
<div className="flex items-center justify-center gap-3 pt-space-lg">
<span className="w-8 h-px bg-surface-container-highest"></span>
<span className="material-symbols-outlined text-primary text-sm">auto_stories</span>
<span className="w-8 h-px bg-surface-container-highest"></span>
</div>
<span className="text-label-mono font-label-mono text-outline text-xs uppercase tracking-widest block pt-2">End of Chapter 14</span>
</div>
</section>
{/*  CHAPTER REACTION PILL STRIP  */}
<section className="mt-space-2xl pt-space-lg flex flex-wrap items-center justify-between gap-space-md bg-surface-container-low p-space-md rounded-2xl shadow-sm">
<div className="flex items-center gap-2">
<span className="text-label-caps font-label-caps text-on-surface-variant uppercase pr-2">React to Chapter:</span>
<button className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-body-sm transition-transform active:scale-95">
<span>🔥</span>
<span className="text-label-mono font-label-mono text-xs">842</span>
</button>
<button className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-body-sm transition-transform active:scale-95">
<span>🤯</span>
<span className="text-label-mono font-label-mono text-xs">610</span>
</button>
<button className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-body-sm transition-transform active:scale-95">
<span>💔</span>
<span className="text-label-mono font-label-mono text-xs">290</span>
</button>
</div>
<div className="flex items-center gap-3">
<button className="flex items-center gap-1 text-on-surface-variant hover:text-primary text-label-mono font-label-mono text-xs">
<span className="material-symbols-outlined text-[16px]">share</span>
<span>Share Excerpt</span>
</button>
<button className="flex items-center gap-1 text-on-surface-variant hover:text-primary text-label-mono font-label-mono text-xs">
<span className="material-symbols-outlined text-[16px]">report</span>
<span>Typo Report</span>
</button>
</div>
</section>
{/*  CHAPTER SEQUENTIAL NAVIGATION  */}
<nav className="mt-space-xl grid grid-cols-1 sm:grid-cols-2 gap-space-md">
{/*  Previous Chapter Link  */}
<Link className="group p-space-md rounded-2xl bg-surface-container-low hover:bg-surface-container-high transition-all shadow-sm flex flex-col justify-between" href="#">
<span className="text-label-caps font-label-caps text-outline uppercase flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">arrow_back</span>
            Previous Chapter
          </span>
<div className="pt-2">
<span className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors block text-base sm:text-lg">Chapter 13: The Spire of Geryon</span>
<span className="text-label-mono font-label-mono text-on-surface-variant text-xs">3,120 words · Published May 11</span>
</div>
</Link>
{/*  Next Chapter Link (Hero Button Callout)  */}
<Link className="group p-space-md rounded-2xl bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-all shadow-lg flex flex-col justify-between" href="#">
<div className="flex items-center justify-between">
<span className="text-label-caps font-label-caps uppercase font-semibold flex items-center gap-1">
              Next Up
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</span>
<span className="text-label-mono font-label-mono text-xs px-2 py-0.5 rounded-full bg-surface-container-lowest/30">Ch. 15</span>
</div>
<div className="pt-2">
<span className="font-headline-sm text-headline-sm transition-colors block text-base sm:text-lg">Chapter 15: Midnight Awakening</span>
<span className="text-label-mono font-label-mono opacity-85 text-xs">Ready to read · 3,890 words</span>
</div>
</Link>
</nav>
{/*  AUTOPLAY NEXT CHAPTER COOLDOWN CONTROLLER  */}
<div className="mt-space-md p-space-md rounded-2xl bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm shadow-sm">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-xl">timer</span>
<div className="flex flex-col">
<span className="text-body-sm font-body-sm font-medium text-on-surface">Auto-Advance to Chapter 15</span>
<span className="text-label-mono font-label-mono text-outline text-xs">Advancing in <strong className="text-on-surface" id="countdown-val">12s</strong>...</span>
</div>
</div>
<div className="flex items-center gap-3">
<button className="px-3 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-label-mono font-label-mono text-xs" id="cancel-countdown-btn">Pause</button>
<Link className="px-3 py-1 rounded-lg bg-surface-bright text-surface-container-lowest font-label-caps text-label-caps uppercase font-bold text-xs" href="#">Read Now</Link>
</div>
</div>
{/*  AUTHOR SHOWCASE & FAN PATRONAGE CARD  */}
<section className="mt-space-2xl p-space-lg rounded-3xl bg-surface-container-low shadow-md space-y-space-md">
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
<div className="flex items-center gap-space-md">
<img className="w-16 h-16 rounded-2xl object-cover shadow-sm" data-alt="Marcus Vance author avatar photo, thoughtful expression, wearing charcoal turtleneck against slate studio background, high quality portraiture." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCw1Y6xxGG87XgloH1cdaIth2Ducs4qQfxUuPgLkWze5m2VQS-iuXZqwTUgJssKrXAtNKLRmBc1p2RWboqpBv9rDyZrSYWnrYpKeuvYjf47nanqUEu8y1tunm9VqhbeqFTZwDIqypB4vkYe_bLfp5FrY8_osfSsmn3w7tfA0fUdvbhSTmK4H785KgQfsKpvzUBvf7UnPIvZsq39IfIR0oz8kn1Y0bLbv58GgvqWF3pVHgm4R95CEU3qwA"/>
<div>
<div className="flex items-center gap-2">
<h3 className="font-headline-md text-headline-md text-on-surface">Marcus Vance</h3>
<span className="text-label-mono font-label-mono px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">Lead Lorekeeper</span>
</div>
<p className="text-body-sm font-body-sm text-on-surface-variant max-w-md pt-0.5">
                Author of The Shadow Chronicles &amp; Worldbuilder of the Aethelgard Saga. Updates every Sunday at midnight UTC.
              </p>
</div>
</div>
<div className="flex items-center gap-2 w-full sm:w-auto">
<button className="flex-1 sm:flex-none px-space-md py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-body-sm font-body-sm font-medium transition-colors">
              Support
            </button>
<button className="flex-1 sm:flex-none px-space-md py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-fixed transition-all text-body-sm font-body-sm font-semibold shadow-md">
              Follow (38.4k)
            </button>
</div>
</div>
<div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs">
<div className="p-space-sm rounded-xl bg-surface-container text-center">
<span className="text-label-mono font-label-mono text-outline text-xs block uppercase">Serial Status</span>
<span className="font-headline-sm text-headline-sm text-tertiary text-sm">Active Ongoing</span>
</div>
<div className="p-space-sm rounded-xl bg-surface-container text-center">
<span className="text-label-mono font-label-mono text-outline text-xs block uppercase">Next Drop</span>
<span className="font-headline-sm text-headline-sm text-on-surface text-sm">Sunday, May 25</span>
</div>
<div className="p-space-sm rounded-xl bg-surface-container text-center">
<span className="text-label-mono font-label-mono text-outline text-xs block uppercase">Canon Rating</span>
<span className="font-headline-sm text-headline-sm text-primary text-sm">★ 4.93 / 5.0</span>
</div>
<div className="p-space-sm rounded-xl bg-surface-container text-center">
<span className="text-label-mono font-label-mono text-outline text-xs block uppercase">Subscribers</span>
<span className="font-headline-sm text-headline-sm text-on-surface text-sm">18,209 Fans</span>
</div>
</div>
</section>
{/*  READER DISCUSSIONS & FAN THEORIES TEASER (142 COMMENTS)  */}
<section className="mt-space-2xl space-y-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<h3 className="font-headline-md text-headline-md text-on-surface">Reader Archive Dispatches</h3>
<span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-mono text-label-mono text-xs">142 Thoughts</span>
</div>
<button className="text-primary text-body-sm font-body-sm hover:underline">Sort: Top Theories ▼</button>
</div>
{/*  Inline Comment Input Box  */}
<div className="p-space-md rounded-2xl bg-surface-container-low shadow-sm flex gap-space-sm">
<img className="w-9 h-9 rounded-full object-cover shrink-0" data-alt="Small modern avatar of female sci-fi fan with purple ambient light on cheek, minimalist digital painting style, dark background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMJf_WTKEDW8l68i4_XE9t6NLnZ3ugdGa5FPpa7_mKmAOdAoFp6RnGlcAlYFs80Y5HTTtNVe4umI-tcP0MME883kNrDHySSkKz7oH020SRa-VrnUMXuMj-C2UFVbHwOjcZZRSS4Qp4fLR_hVEj9DRqWCNqvgR-GlaeyYUqgvIn_pGIgLmLvh6FrvbNR1J1ivv_m-Hf2M_xHeWl_KizyW8Av1JdGjqoYc4u5VV2E1NzzEkyhupYPqrDvg"/>
<div className="flex-1 space-y-space-xs">
<textarea className="w-full bg-surface-container-high rounded-xl p-3 text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary resize-none" placeholder="Leave a reaction, lore theory, or question for Marcus..." rows={2}></textarea>
<div className="flex items-center justify-between pt-1">
<div className="flex items-center gap-2 text-outline text-xs font-label-mono">
<button className="hover:text-on-surface">Markdown Supported</button>
<span>·</span>
<button className="hover:text-on-surface flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">lock</span>
<span>Spoiler Tag</span>
</button>
</div>
<button className="px-4 py-1.5 rounded-xl bg-primary text-on-primary text-label-caps font-label-caps uppercase tracking-wider font-semibold shadow-sm hover:bg-primary-fixed">Post Note</button>
</div>
</div>
</div>
{/*  Pinned Fan Comment Card  */}
<article className="p-space-md rounded-2xl bg-surface-container-low shadow-sm space-y-space-xs">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<img className="w-8 h-8 rounded-full object-cover" data-alt="Avatar of male fiction reader with round spectacles and warm cinematic portrait lighting, high detail digital headshot." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5X1nVeChY7gaawanlEKYxVtawZowal9TjHqdahIfVZL_EC7y-MYg1c2UqUq2yJpilx99DphzEaUkLV5Bct4WoI-Iz6vpJweu5W0VmfBjHpQCxGoTCUJd3-EORuDqoEAdouTfsVRmdeHj63TH2njkEFS82VQnV0cGK6nmrFYQ_5XBB8FUQdcGaIropYDwXyxr15ZLyBGxleYY1q4fAlJmwKagiKEayAwQ_6QoO1kYrazwMjT3ccwygrw"/>
<div>
<span className="font-body-sm font-body-sm font-semibold text-on-surface">KaelenTheorist_99</span>
<span className="text-label-mono font-label-mono text-outline text-xs ml-2">2 hours ago</span>
</div>
</div>
<span className="px-2 py-0.5 rounded bg-tertiary-container/30 text-tertiary font-label-mono text-xs">Top Canon Theory</span>
</div>
<p className="text-body-default font-body-default text-on-surface-variant text-sm leading-relaxed pl-10">
            The mention of sulfur and crushed celestine in paragraph 3 confirms the Inquisitors are collaborating with the Guild of Siphoners! Go back to Book I Chapter 4: Marcus warned that celestine dissolves harmonic resonance. That&apos;s why Vaelen&apos;s sword didn&apos;t ring!
          </p>
<div className="flex items-center gap-4 pl-10 pt-1 text-label-mono font-label-mono text-xs text-outline">
<button className="flex items-center gap-1 hover:text-primary">
<span className="material-symbols-outlined text-[15px]">thumb_up</span>
<span>184 Upvotes</span>
</button>
<button className="flex items-center gap-1 hover:text-on-surface">
<span className="material-symbols-outlined text-[15px]">reply</span>
<span>23 Replies</span>
</button>
</div>
</article>
{/*  Second Fan Comment Card  */}
<article className="p-space-md rounded-2xl bg-surface-container-low shadow-sm space-y-space-xs">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<img className="w-8 h-8 rounded-full object-cover" data-alt="Digital stylized portrait of fantasy reader smiling gently, soft violet studio illumination on face, dark background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWSC6lqhcvcUuy_iRnsjuU3U8Q_yvVDlHrkDJtOOQqmFG1soj1HIuryO8jWb0iOKa5lBWUvkZBSXXI6f7syfHGPP3w4MX6RBukQ-vKYI8u7AZkFM-9TtDCS7eiHIMFkjEn-9YwbT5Ixpqc32vDFHGOocdeMjvd4bvdweNsgdGrk6ZBc1cnknl-WqBoBHYrp7VFNKN53Py0RqMZE5N8vTxd4JZNkoYstTgUW3JMybC5wdWqkhbTN4C3yg"/>
<div>
<span className="font-body-sm font-body-sm font-semibold text-on-surface">Elysia_Wanderer</span>
<span className="text-label-mono font-label-mono text-outline text-xs ml-2">5 hours ago</span>
</div>
</div>
</div>
<p className="text-body-default font-body-default text-on-surface-variant text-sm leading-relaxed pl-10">
            "Light is simply fire searching for something fresh to consume." That quote gave me actual chills. The worldbuilding in this arc is by far the strongest in the series.
          </p>
<div className="flex items-center gap-4 pl-10 pt-1 text-label-mono font-label-mono text-xs text-outline">
<button className="flex items-center gap-1 hover:text-primary">
<span className="material-symbols-outlined text-[15px]">thumb_up</span>
<span>78 Upvotes</span>
</button>
<button className="flex items-center gap-1 hover:text-on-surface">
<span className="material-symbols-outlined text-[15px]">reply</span>
<span>6 Replies</span>
</button>
</div>
</article>
{/*  View All Comments Button  */}
<div className="text-center pt-space-sm">
<button className="w-full py-3 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface text-body-sm font-body-sm font-medium transition-colors shadow-sm">
            Load All 142 Reader Comments &amp; Lore Notes
          </button>
</div>
</section>
</article>
</main>
</div>
    </>
  );
}
