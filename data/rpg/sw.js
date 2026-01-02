const CACHE_NAME = 'gemini-sonic-v1';
const ASSETS = [
  './',
  './audiov15.html',
  './sw.js',
  './lang.js',
  './lang.json',
  './ja_jp.json',
  './en_us.json',
  './pt_br.json',
  './de_de.json',
  './es_es.json',
  './fr_fr.json',
  './ko_kr.json',
  './zh_cn.json',
  './audio-check.html',
  './audio.html',
  './audio.js',
  './audio2.html',
  './kiyaku.html',
  './audio-rest.html',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  '/rei/logo.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
