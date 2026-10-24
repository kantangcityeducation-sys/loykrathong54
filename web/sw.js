/* Service Worker — ทำให้เปิดเว็บได้แม้ไม่มีอินเทอร์เน็ต
   เมื่อแก้ไขไฟล์ใด ๆ ในโฟลเดอร์ web ให้เปลี่ยนเลข VERSION เพื่อให้ทุกเครื่องโหลดไฟล์ใหม่ */
const VERSION = 'cl54-v3-20261024';
const SHELL = [
  './', 'index.html', 'config.js', 'manifest.webmanifest', 'css/app.css', 'css/savebar.css',
  'js/data/current-data.js', 'js/data/seed-data.js', 'js/core/state.js', 'js/data/doc-forms.js', 'js/core/mutations.js',
  'js/views/menu-teams-draw.js', 'js/views/program.js', 'js/views/registry-lineup.js',
  'js/views/disciplinary-docs.js', 'js/core/router.js', 'js/core/print.js', 'js/core/images-cover.js',
  'js/views/projector.js', 'js/views/results-home.js', 'js/views/settings.js', 'js/core/shift-dates.js',
  'js/core/sync.js', 'js/core/savebar.js', 'js/core/events.js', 'js/core/pwa.js', 'js/core/boot.js',
  'assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/images/logo.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
/* ออนไลน์: ใช้ไฟล์ล่าสุดจากเครื่องแม่ข่าย (รอไม่เกิน 3 วินาที) · ออฟไลน์/สัญญาณแย่: ใช้ไฟล์ที่เก็บไว้
   คำขอไปยังเซิร์ฟเวอร์ข้อมูล (script.google.com) ไม่ผ่าน Service Worker */
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    try {
      const net = await Promise.race([
        fetch(r),
        new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), 3000))
      ]);
      if (net && net.ok) cache.put(r, net.clone());
      return net;
    } catch (err) {
      const hit = await cache.match(r, { ignoreSearch: true }) || (r.mode === 'navigate' ? await cache.match('index.html') : null);
      if (hit) return hit;
      return fetch(r);
    }
  })());
});
