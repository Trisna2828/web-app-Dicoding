importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox)
  console.log(`Workbox has been loaded`);
else
  console.log(`Failed to load Workbox`);

//Precaching Appshell
workbox.precaching.precacheAndRoute([
  { url: '/', revision: '1' },
  { url: '/index.html', revision: '1' },
  { url: '/nav.html', revision: '1' },
  { url: '/manifest.json', revision: '1' },
  { url: '/img/icon_512.png', revision: '1' },
  { url: '/img/icon_192.png', revision: '1' },
  { url: '/img/notification.png', revision: '1' },
  { url: '/img/teambadge.png', revision: '1' },
  { url: '/img/champions_league.png', revision: '1' },
  { url: '/img/football-player.png', revision: '1' },
  { url: '/img/home-team.png', revision: '1' },
  { url: '/img/away-team.png', revision: '1' },
  { url: '/pages/home.html', revision: '1' },
  { url: '/pages/likes.html', revision: '1' },
  { url: '/pages/team.html', revision: '1' },
  { url: '/pages/match.html', revision: '1' },
  { url: '/css/materialize.min.css', revision: '1' },
  { url: '/js/idb.js', revision: '1' },
  { url: '/js/api.js', revision: '1' },
  { url: '/js/materialize.min.js', revision: '1' },
  { url: '/js/jquery-3.5.1.min.js', revision: '1' },
  { url: '/js/regis.js', revision: '1' },
  { url: '/js/nav.js', revision: '1' },
  { url: '/js/db.js', revision: '1' },
  { url: 'https://fonts.googleapis.com/icon?family=Material+Icons', revision: '1' },
  { url: 'https://unpkg.com/snarkdown@1.0.2/dist/snarkdown.umd.js', revision: '1' },
  { url: 'https://fonts.gstatic.com/s/materialicons/v53/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2', revision: '1' },
]);

workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/'),
  workbox.strategies.staleWhileRevalidate()
  )

workbox.routing.registerRoute(
  new RegExp('/pages/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'pages'
    })
);

workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'resources'
  })
);

workbox.routing.registerRoute(
  /.*(?:png|gif|jpg|jpeg|svg|ico)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'images'
  })
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.cacheFirst({
      cacheName: 'google-material-icon',
      plugins: [
          new workbox.cacheableResponse.Plugin({
              statuses: [0, 200],
          }),
          new workbox.expiration.Plugin({
              maxAgeSeconds: 60 * 60 * 24 * 100,
              maxEntries: 30,
          }),
      ],
  })
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
      cacheName: 'google-fonts-webfonts',
      plugins: [
          new workbox.cacheableResponse.Plugin({
              statuses: [0, 200],
          }),
          new workbox.expiration.Plugin({
              maxAgeSeconds: 60 * 60 * 24 * 100,
              maxEntries: 30,
          }),
      ],
  })
);


//push notification
self.addEventListener('push', function(event) {
  let body;
  if(event.data) {
    body = event.data.text();
  } else {
    body = "Push message no payload";
  }
  let options = {
    body: body,
    icon: 'img/notification.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});
