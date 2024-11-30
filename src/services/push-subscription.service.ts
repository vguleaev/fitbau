import prisma from '@/db/prisma';
import type { PushSubscription } from '@/types/push-subscription';

async function saveSubscription(subscription: PushSubscription, userId: string): Promise<void> {
  await prisma.pushMessageSubscription.create({
    data: {
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      userId,
    },
  });
}

export { saveSubscription };
