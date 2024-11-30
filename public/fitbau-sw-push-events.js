self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  event.waitUntil(self.skipWaiting()); // Forces the waiting service worker to become active
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Handle push event
// In Chrome DevTools, you can send a push message from the Application tab. Simulate a push event from Push server.
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.text() : 'No payload';
  console.log('Push event received:', data);

  const options = {
    body: data,
    icon: '/favicon.ico',
  };

  event.waitUntil(self.registration.showNotification('Push Notification', options));
});
