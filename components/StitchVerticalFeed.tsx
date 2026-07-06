import * as React from 'react';

export function StitchVerticalFeed({ 
  title, 
  description, 
  content 
}: { 
  title: string, 
  description: string, 
  content?: React.ReactNode 
}) {
  return (
    <div className="bg-surface-container-lowest text-on-surface font-body overflow-y-auto min-h-screen relative hide-scrollbar">
      

<div className="fixed inset-0 z-0 overflow-hidden">
<img alt="Cinematic movie trailer frame with dramatic lighting" className="w-full h-full object-cover" data-alt="Dramatic cinematic movie trailer still with dark atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJo5kFl-F9sshg3j98peSjCuXus1ODOk32llARHSb4ZbV3WDDAlRO4zJ9opsMUWuagdzrcBhGlAsv2ep7sPqvM4N5IjxeSWIEDiTA3ri7vWDc-fZS90E2R67bydx7eO7r412LUneQHJSvifJH-7taVYvScB80Jozl-eOBsUCmQ2m81XkY9NvJuo383R5loOOdz2YH__f9MGWTVVsoNda1lxfHkIXccEeWA9_CuKMnN0PYSud1wDDSFHw5h_2lzaiaFIehJ4g39Lkk"/>

<div className="fixed inset-0 vertical-gradient-overlay opacity-90 z-0 pointer-events-none"></div>
<div className="fixed inset-y-0 right-0 w-32 side-gradient-overlay opacity-60 z-0 pointer-events-none"></div>
</div>

<main className="relative z-10 min-h-screen flex flex-col justify-end px-6 pt-32 pb-32">

<div className="absolute right-4 bottom-48 flex flex-col items-center gap-6 z-20">

<div className="flex flex-col items-center gap-1">
<div className="glass-panel w-14 h-14 rounded-full flex items-center justify-center border border-outline-variant/20">
<span className="material-symbols-outlined text-on-surface text-3xl" data-icon="favorite">favorite</span>
</div>
<span className="text-[11px] font-medium tracking-wider text-on-surface-variant">Like</span>
</div>

<div className="flex flex-col items-center gap-1">
<div className="glass-panel w-14 h-14 rounded-full flex items-center justify-center border border-outline-variant/20">
<span className="material-symbols-outlined text-on-surface text-3xl" data-icon="add_to_photos">add_to_photos</span>
</div>
<span className="text-[11px] font-medium tracking-wider text-on-surface-variant">Save</span>
</div>

<div className="flex flex-col items-center gap-1">
<div className="glass-panel w-14 h-14 rounded-full flex items-center justify-center border border-outline-variant/20">
<span className="material-symbols-outlined text-on-surface text-3xl" data-icon="share">share</span>
</div>
<span className="text-[11px] font-medium tracking-wider text-on-surface-variant">Share</span>
</div>
</div>

<div className="max-w-md space-y-4">

<div className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary-container/30 border border-tertiary/20">
<span className="text-[10px] font-bold tracking-widest text-tertiary uppercase">Tutorial</span>
</div>

<h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight tracking-tight text-on-surface">
    {title}
</h1>

<p className="text-on-surface-variant text-base leading-relaxed max-w-[85%]">
    {description}
</p>

{content && (
  <div className="prose prose-invert prose-p:text-on-surface-variant prose-headings:text-on-surface max-w-none mt-6 pb-20">
    {content}
  </div>
)}

<div className="pt-4 flex items-center gap-4">
<button className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold px-8 py-4 rounded-full neon-glow transition-transform active:scale-95 flex items-center gap-2">
<span className="material-symbols-outlined text-xl" data-icon="play_arrow" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                    Watch Now
                </button>
<button className="glass-panel text-on-surface border border-outline-variant/30 px-6 py-4 rounded-full font-medium transition-transform active:scale-95">
                    More Info
                </button>
</div>
</div>
</main>

<div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-30">
<nav className="glass-panel rounded-full px-8 py-4 border border-outline-variant/20 flex justify-between items-center shadow-2xl">

<a className="flex flex-col items-center gap-1 group" href="#">
<div className="relative">

<div className="absolute inset-0 bg-primary/20 blur-md rounded-full scale-150"></div>
<span className="material-symbols-outlined text-primary relative z-10" data-icon="play_circle" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
</div>
<span className="text-[10px] font-bold tracking-wide text-primary">Feed</span>
</a>

<a className="flex flex-col items-center gap-1 group opacity-60 hover:opacity-100 transition-opacity" href="/feed">
<span className="material-symbols-outlined text-on-surface" data-icon="explore">explore</span>
<span className="text-[10px] font-bold tracking-wide">Discover</span>
</a>

<a className="flex flex-col items-center gap-1 group opacity-60 hover:opacity-100 transition-opacity" href="/">
<span className="material-symbols-outlined text-on-surface" data-icon="explore">explore</span>
<span className="text-[10px] font-bold tracking-wide">Discover</span>
</a>
</nav>
</div>

<div className="fixed top-0 inset-x-0 h-12 flex justify-between items-center px-8 z-40 opacity-80 pointer-events-none">
<span className="text-sm font-medium">9:41</span>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-lg" data-icon="signal_cellular_4_bar">signal_cellular_4_bar</span>
<span className="material-symbols-outlined text-lg" data-icon="wifi">wifi</span>
<span className="material-symbols-outlined text-lg" data-icon="battery_full">battery_full</span>
</div>
</div>

    </div>
  );
}
