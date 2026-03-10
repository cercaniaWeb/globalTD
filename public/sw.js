self.addEventListener('push', function (event) {
    const data = event.data?.json() ?? {};
    const title = data.title ?? 'Global Telecom';
    const options = {
        body: data.body ?? 'Nueva actualización del sistema',
        icon: '/logo.png',
        badge: '/logo.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
