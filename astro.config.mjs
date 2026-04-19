import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://afterwage.com',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      // Priority hints tell Google which pages matter most.
      // Homepage = 1.0, methodology/about = 0.8 (meaningful content),
      // contact/privacy/terms = 0.3 (compliance/utility pages, lower priority).
      serialize(item) {
        const url = new URL(item.url);
        if (url.pathname === '/') {
          item.priority = 1.0;
          item.changefreq = 'monthly';
        } else if (url.pathname === '/methodology' || url.pathname === '/about') {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (url.pathname === '/contact') {
          item.priority = 0.3;
          item.changefreq = 'yearly';
        } else if (url.pathname === '/privacy' || url.pathname === '/terms') {
          item.priority = 0.3;
          item.changefreq = 'yearly';
        }
        return item;
      },
    }),
  ],
});
