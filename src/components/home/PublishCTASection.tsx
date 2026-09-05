'use client';

import Link from 'next/link';

export default function PublishCTASection() {
  const features = [
    {
      icon: '🌐',
      title: 'Start a New Wiki',
      description: 'Create a comprehensive wiki for your favorite anime, game, or web novel series.',
    },
    {
      icon: '✏️',
      title: 'Edit & Contribute',
      description: 'Add pages, update information, and help keep wikis accurate and up-to-date.',
    },
    {
      icon: '🏆',
      title: 'Earn Recognition',
      description: 'Get badges and ranks as you contribute. Top editors are featured on our leaderboard.',
    },
    {
      icon: '👥',
      title: 'Build Community',
      description: 'Connect with fellow fans, discuss theories, and grow the fandom together.',
    },
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-purple-500/5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <span className="section-subtitle">Become a Contributor</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Help Build the Ultimate Fan Resource
            </h2>
            <p className="text-lg text-foreground-muted mb-8">
              Join thousands of fans documenting their favorite series. Whether you are an expert or just getting started,
              your contributions make our wikis the best resource for fans worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/create-wiki" className="btn btn-primary text-lg px-8 py-3">
                Start a Wiki
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </Link>
              <Link href="/contribute" className="btn btn-secondary text-lg px-8 py-3">
                Learn to Contribute
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4 border-t border-border">
              <div>
                <p className="text-2xl font-bold text-accent">100K+</p>
                <p className="text-foreground-muted text-sm">Contributors</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">500+</p>
                <p className="text-foreground-muted text-sm">Active Wikis</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">5M+</p>
                <p className="text-foreground-muted text-sm">Monthly Visitors</p>
              </div>
            </div>
          </div>

          {/* Right Content - Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-6 hover:border-accent"
              >
                <span className="text-3xl mb-4 block">{feature.icon}</span>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-foreground-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
