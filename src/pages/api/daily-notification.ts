import prisma from '@/db/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import webpush from 'web-push';

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!,
};

webpush.setVapidDetails('https://fitbau.vercel.app', vapidKeys.publicKey, vapidKeys.privateKey);

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const subscriptions = await prisma.pushMessageSubscription.findMany();

  for (const subscription of subscriptions) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: subscription.userId,
        },
      });

      const userName = user?.name || 'Friend';
      const notificationText = `Hello, ${userName}! Are you already in gym?`;

      const mappedSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          auth: subscription.auth,
          p256dh: subscription.p256dh,
        },
      };
      await webpush.sendNotification(mappedSubscription, notificationText);
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }

  return response.status(200).json({ success: true });
}
