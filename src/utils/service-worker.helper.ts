const SERVICE_WORKER_URL = '/fitbau-sw-push-events.js';

const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register(SERVICE_WORKER_URL);

    await Notification.requestPermission();

    if (Notification.permission !== 'granted' && Notification.permission !== 'default') {
      console.error('Notification permission not granted.');
      return;
    }

    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      await subscribeUserToPush(registration);
    }
  } catch (error) {
    console.error('Service worker registration failed:', error);
  }
};

const subscribeUserToPush = async (registration: ServiceWorkerRegistration) => {
  try {
    const applicationServerKey = urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    });

    console.log('User is subscribed:', subscription);

    await fetch(`/api/push-subscribe`, {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to subscribe the user: ', error);
  }
};

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export { registerServiceWorker };
