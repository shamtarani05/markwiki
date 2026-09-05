'use client';

import Link from 'next/link';
import type { JSX } from 'react';

interface Activity {
  id: string;
  type: 'edit' | 'create' | 'comment';
  user: string;
  userAvatar: string;
  page: string;
  wiki: string;
  wikiSlug: string;
  timestamp: string;
  summary?: string;
}

const recentActivity: Activity[] = [
  {
    id: '1',
    type: 'edit',
    user: 'ShadowHunter99',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&q=80',
    page: 'Sung Jin-Woo/Abilities',
    wiki: 'Solo Leveling',
    wikiSlug: 'solo-leveling',
    timestamp: '2 min ago',
    summary: 'Added information about Shadow Monarch powers',
  },
  {
    id: '2',
    type: 'create',
    user: 'CursedEnergy',
    userAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&q=80',
    page: 'Reverse Cursed Technique',
    wiki: 'Jujutsu Kaisen',
    wikiSlug: 'jujutsu-kaisen',
    timestamp: '15 min ago',
    summary: 'Created new page for RCT mechanics',
  },
  {
    id: '3',
    type: 'edit',
    user: 'TarnishedOne',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80',
    page: 'Malenia, Blade of Miquella',
    wiki: 'Elden Ring',
    wikiSlug: 'elden-ring',
    timestamp: '32 min ago',
    summary: 'Updated boss strategies and attack patterns',
  },
  {
    id: '4',
    type: 'comment',
    user: 'MysterySeeker',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80',
    page: 'Pathway System',
    wiki: 'Lord of the Mysteries',
    wikiSlug: 'lord-of-the-mysteries',
    timestamp: '1 hour ago',
    summary: 'Discussion about Sequence 0 powers',
  },
  {
    id: '5',
    type: 'edit',
    user: 'AnimeExpert',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80',
    page: 'Gear Fifth',
    wiki: 'One Piece',
    wikiSlug: 'one-piece',
    timestamp: '2 hours ago',
    summary: 'Added manga chapter references',
  },
  {
    id: '6',
    type: 'create',
    user: 'GenshinPro',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80',
    page: 'Natlan Region Guide',
    wiki: 'Genshin Impact',
    wikiSlug: 'genshin-impact',
    timestamp: '3 hours ago',
    summary: 'New region overview and exploration tips',
  },
];

const activityIcons: Record<string, { icon: JSX.Element; color: string }> = {
  'edit': {
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    color: 'badge-blue',
  },
  'create': {
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    color: 'badge-green',
  },
  'comment': {
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    color: 'badge-purple',
  },
};

export default function RecentActivitySection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="section-subtitle">Live Updates</span>
                <h2 className="section-title">Recent Activity</h2>
              </div>
              <Link href="/activity" className="btn btn-secondary hidden sm:flex">
                View All
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="card divide-y divide-border">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-background-secondary/50 transition-colors">
                  <div className="flex items-start gap-3">
                    {/* User Avatar */}
                    <img
                      src={activity.userAvatar}
                      alt={activity.user}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground">{activity.user}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${activityIcons[activity.type].color}`}>
                          {activity.type === 'edit' ? 'edited' : activity.type === 'create' ? 'created' : 'commented on'}
                        </span>
                        <Link
                          href={`/wiki/${activity.wikiSlug}`}
                          className="text-accent text-sm hover:underline"
                        >
                          {activity.wiki}
                        </Link>
                      </div>
                      <Link
                        href={`/wiki/${activity.wikiSlug}/${activity.page.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-foreground hover:text-accent transition-colors font-medium block mt-1"
                      >
                        {activity.page}
                      </Link>
                      {activity.summary && (
                        <p className="text-foreground-muted text-sm mt-1">{activity.summary}</p>
                      )}
                      <p className="text-foreground-muted text-xs mt-2">{activity.timestamp}</p>
                    </div>

                    {/* Activity Type Icon */}
                    <div className={`p-2 rounded-full ${activityIcons[activity.type].color}`}>
                      {activityIcons[activity.type].icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Top Contributors & Join CTA */}
          <div className="space-y-6">
            {/* Join Community CTA */}
            <div className="card p-6 bg-gradient-to-br from-accent/10 to-purple-500/10 border-accent/20">
              <h3 className="text-xl font-bold text-foreground mb-3">Join the Community</h3>
              <p className="text-foreground-muted mb-4">
                Contribute to your favorite wikis, earn badges, and connect with fellow fans.
              </p>
              <Link href="/signup" className="btn btn-primary w-full justify-center">
                Create Account
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <p className="text-center text-foreground-muted text-sm mt-3">
                Already have an account?{' '}
                <Link href="/login" className="text-accent hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Top Contributors */}
            <div className="card p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Top Contributors
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'ShadowHunter99', edits: 1234, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&q=80' },
                  { name: 'CursedEnergy', edits: 987, avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&q=80' },
                  { name: 'TarnishedOne', edits: 876, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80' },
                  { name: 'MysterySeeker', edits: 654, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80' },
                  { name: 'AnimeExpert', edits: 543, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80' },
                ].map((contributor, index) => (
                  <div key={contributor.name} className="flex items-center gap-3">
                    <span className="text-foreground-muted font-medium w-4">{index + 1}</span>
                    <img
                      src={contributor.avatar}
                      alt={contributor.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{contributor.name}</p>
                      <p className="text-xs text-foreground-muted">{contributor.edits.toLocaleString()} edits</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/contributors" className="text-accent text-sm hover:underline mt-4 block">
                View all contributors →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
