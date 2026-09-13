'use client';

import { ReactNode, useEffect, useState } from 'react';

interface GlobalThemeWrapperProps {
  children: ReactNode;
  initialThemeConfig?: any;
}

export default function GlobalThemeWrapper({ children, initialThemeConfig }: GlobalThemeWrapperProps) {
  const [themeConfig, setThemeConfig] = useState(initialThemeConfig);

  useEffect(() => {
    // Listen for cross-window messages (from admin preview)
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'UPDATE_THEME_CONFIG' && e.data?.config) {
        setThemeConfig(e.data.config);
      }
      if (e.data?.type === 'LIVE_PREVIEW_UPDATE' && e.data?.data?.theme) {
        setThemeConfig(e.data.data.theme);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <>
      {themeConfig?.accentColor && (
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --accent: ${themeConfig.accentColor};
              --color-accent: ${themeConfig.accentColor};
              --primary: ${themeConfig.accentColor};
            }
          `
        }} />
      )}
      {children}
    </>
  );
}
