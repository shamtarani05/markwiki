'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section className="relative min-h-[calc(100vh-72px)] flex items-center py-16 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />

      {/* Decorative Elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-2xl" />
      <div className="absolute top-40 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium mb-6">
              🎮 The Ultimate Fan Wiki Platform
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your Hub for{' '}
              <span className="text-accent">Anime, Games</span>
              <br />& Web Novels
            </h1>

            <p className="text-lg text-foreground-muted mb-8 max-w-xl mx-auto lg:mx-0">
              Explore comprehensive wikis for your favorite anime, webtoons, web novels, and video games.
              Discover characters, lore, and connect with passionate fan communities.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto lg:mx-0 mb-8">
              <input
                type="text"
                placeholder="Search wikis, characters, series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pr-14 rounded-full bg-card border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start mb-8">
              <span className="text-foreground-muted text-sm">Popular:</span>
              <Link href="/wiki/solo-leveling" className="px-3 py-1 bg-card border border-border rounded-full text-sm hover:border-accent hover:text-accent transition-colors">
                Solo Leveling
              </Link>
              <Link href="/wiki/jujutsu-kaisen" className="px-3 py-1 bg-card border border-border rounded-full text-sm hover:border-accent hover:text-accent transition-colors">
                Jujutsu Kaisen
              </Link>
              <Link href="/wiki/elden-ring" className="px-3 py-1 bg-card border border-border rounded-full text-sm hover:border-accent hover:text-accent transition-colors">
                Elden Ring
              </Link>
              <Link href="/wiki/lotm" className="px-3 py-1 bg-card border border-border rounded-full text-sm hover:border-accent hover:text-accent transition-colors">
                Lord of the Mysteries
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-8 justify-center lg:justify-start">
              <div>
                <p className="text-3xl font-bold text-foreground">500+</p>
                <p className="text-foreground-muted text-sm">Wikis</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <p className="text-3xl font-bold text-foreground">50K+</p>
                <p className="text-foreground-muted text-sm">Pages</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <p className="text-3xl font-bold text-foreground">100K+</p>
                <p className="text-foreground-muted text-sm">Contributors</p>
              </div>
            </div>
          </div>

          {/* Right Content - Wiki Cards Display */}
          <div className="relative hidden lg:block">
            <div className="relative flex items-center justify-center">
              {/* Main Featured Wiki Card */}
              <div className="relative z-20 w-72 transform hover:scale-105 transition-transform duration-300">
                <div className="rounded-xl shadow-2xl overflow-hidden bg-card border border-border">
                  <div className="h-40 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=200&fit=crop&q=80"
                      alt="Solo Leveling"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 badge-purple rounded text-xs font-medium">Manhwa</span>
                      <span className="px-2 py-0.5 badge-blue rounded text-xs font-medium">Anime</span>
                    </div>
                    <h3 className="font-bold text-foreground text-lg">Solo Leveling Wiki</h3>
                    <p className="text-foreground-muted text-sm mt-1">1,247 pages • 89K monthly views</p>
                  </div>
                </div>
              </div>

              {/* Side Cards */}
              <div className="absolute left-0 z-10 w-56 transform -rotate-6 -translate-x-12 -translate-y-8 opacity-80 hover:opacity-100 transition-opacity">
                <div className="rounded-xl shadow-xl overflow-hidden bg-card border border-border">
                  <div className="h-28 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=150&fit=crop&q=80"
                      alt="Elden Ring"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <span className="px-2 py-0.5 badge-green rounded text-xs font-medium">Game</span>
                    <h3 className="font-bold text-foreground mt-1">Elden Ring Wiki</h3>
                  </div>
                </div>
              </div>

              <div className="absolute right-0 z-10 w-56 transform rotate-6 translate-x-12 translate-y-8 opacity-80 hover:opacity-100 transition-opacity">
                <div className="rounded-xl shadow-xl overflow-hidden bg-card border border-border">
                  <div className="h-28 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=300&h=150&fit=crop&q=80"
                      alt="Jujutsu Kaisen"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <span className="px-2 py-0.5 badge-red rounded text-xs font-medium">Anime</span>
                    <h3 className="font-bold text-foreground mt-1">Jujutsu Kaisen Wiki</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
