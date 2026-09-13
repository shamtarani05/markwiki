import connectDB from '@/src/lib/db/connection';
import SiteConfig from '@/src/lib/db/models/SiteConfig';

export interface NavItem {
  label: string;
  url: string;
  order: number;
  isExternal: boolean;
  children?: NavItem[];
}

export interface NavigationConfig {
  main: NavItem[];
  footer: NavItem[];
}

export interface SocialConfig {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  discord?: string;
}

export async function getNavigationConfig(): Promise<{
  navigation: NavigationConfig;
  social: SocialConfig;
}> {
  await connectDB();
  const config = await SiteConfig.findOne().lean();

  const defaultNavigation: NavigationConfig = {
    main: [
      { label: 'Home', url: '/', order: 0, isExternal: false },
      { label: 'Anime', url: '/category/anime', order: 1, isExternal: false },
      { label: 'Games', url: '/category/games', order: 2, isExternal: false },
      { label: 'Novels', url: '/category/novels', order: 3, isExternal: false },
      { label: 'Trending', url: '/trending', order: 4, isExternal: false },
      { label: 'Community', url: '/community', order: 5, isExternal: false },
    ],
    footer: [
      { label: 'Explore', url: '/explore', order: 0, isExternal: false },
      { label: 'Trending', url: '/trending', order: 1, isExternal: false },
      { label: 'Categories', url: '/categories', order: 2, isExternal: false },
      { label: 'Guidelines', url: '/guidelines', order: 3, isExternal: false },
      { label: 'Terms', url: '/terms', order: 4, isExternal: false },
      { label: 'Privacy', url: '/privacy', order: 5, isExternal: false },
    ],
  };

  const defaultSocial: SocialConfig = {
    twitter: 'https://twitter.com',
    discord: 'https://discord.com',
  };

  return {
    navigation: {
      main: config?.navigation?.main?.length ? config.navigation.main : defaultNavigation.main,
      footer: config?.navigation?.footer?.length ? config.navigation.footer : defaultNavigation.footer,
    },
    social: {
      ...defaultSocial,
      ...config?.social,
    },
  };
}
