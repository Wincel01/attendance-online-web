var cacheName = 'educef3';

console.log('... Service Worker File Running ...');

/*

var filesToCache = ['./' , './index.html' ,'assets/css/animate.css','assets/css/customcss.css'
 ,'assets/css/bootstrap.min.css' ,'assets/css/style.css' , './header.html' , './footer.html' , './head&foot.js'
 ,'assets/lib/slick/slick.css' ,'assets/lib/slick/slick-theme.css' , 'assets/img/favicon.ico' , 'assets/css/font/flaticon/flaticon.css'
 , 'assets/lib/js/jquery-3.3.1.min.js' , 'assets/lib/js/bootstrap.min.js' , 'assets/lib/slick/slick.min.js' , 'assets/js/wow.js'
 , 'assets/js/jquery-matchHeight.js' , 'assets/js/slicks.js' , 'assets/js/home.js' , 'assets/js/customjs/index.js',
 'assets/js/script.js'

];

*/


var filesToCache = ['./' , './index.html'];


self.addEventListener('install', function(e) {
    self.skipWaiting();
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }

            }));
        })
        
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (ev) => {
    console.log('Fetch from Service Worker ', ev);
    const req = ev.request;
    const url = new URL(req.url);
    if (url.origin === location.origin) {
      ev.respondWith(cacheFirst(req));
    }
    return ev.respondWith(networkFirst(req));
  });
  
  async function cacheFirst(req) {
    let cacheRes = await caches.match(req);
    return cacheRes || fetch(req);
  }
  
  async function networkFirst(req) {
    const dynamicCache = await caches.open('v1-dynamic');
    try {
      const networkResponse = await fetch(req);
      dynamicCache.put(req, networkResponse.clone());
      return networkResponse;
    } catch (err) {
      const cacheResponse = await caches.match(req);
      return cacheResponse;
    }
  }
// offline msg

self.addEventListener('message', function (evt) {
    console.log('postMessage received', evt.data);
  });
