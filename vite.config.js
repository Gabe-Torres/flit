import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { viteSingleFile } from 'vite-plugin-singlefile';

const root = dirname(fileURLToPath(import.meta.url));

// iOS will not run a type="module" script opened from a file. The bundle is
// one classic script with no imports, so a home-screen install can start it.
function classicInlineScript() {
  return {
    name: 'classic-inline-script',
    enforce: 'post',
    generateBundle(_options, bundle) {
      for (const item of Object.values(bundle)) {
        if (item.type !== 'asset' || typeof item.source !== 'string') continue;
        if (!item.fileName.endsWith('.html')) continue;
        const open = item.source.match(/<script type="module"(?: crossorigin)?>/);
        if (!open || open.index === undefined) continue;
        const start = open.index + open[0].length;
        // The module bundle is one script. A later classic script, such as the
        // service worker registration, must stay outside it.
        const end = item.source.indexOf('</script>', start);
        if (end < start) continue;
        // A library string of "</script>" would end the inline tag early.
        // import.meta is module syntax. Pixi only passes the URL into Vite's
        // preload helper, and that helper never runs for this inlined build.
        const code = item.source
          .slice(start, end)
          .replace(/<\/script/gi, '<\\/script')
          .replace(/\bimport\.meta\b/g, '({url:location.href})');
        item.source =
          item.source.slice(0, open.index) +
          `<script>document.addEventListener('DOMContentLoaded',function(){${code}});</script>` +
          item.source.slice(end + '</script>'.length);
      }
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{html,webmanifest,png,ico}'],
        // An empty assetsDir makes the plugin treat every URL as already hashed,
        // which would freeze index.html in the cache.
        dontCacheBustURLsMatching: /^$/,
        navigateFallback: 'index.html',
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 12, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
    viteSingleFile(),
    classicInlineScript(),
  ],
  build: {
    cssCodeSplit: false,
    sourcemap: false,
    rollupOptions: {
      input: resolve(root, 'index.html'),
    },
  },
  server: { port: 5173, strictPort: false },
});
