importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

// 缓存名前缀
workbox.core.setCacheNameDetails({ prefix: 'my-blog' });

// 让旧 SW 立即失效
workbox.core.clientsClaim();
workbox.core.skipWaiting();

// 预缓存列表由 gulp 注入
workbox.precaching.precacheAndRoute([]);

// 运行时策略
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 天
      })
    ]
  })
);

workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'assets'
  })
);

workbox.routing.registerRoute(
  /\/$/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'html'
  })
);