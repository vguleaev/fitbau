import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import type { PushSubscription } from '@/types/push-subscription';
import { saveSubscription } from '@/services/push-subscription.service';

type SaveSubscriptionApiResponse = SuccessResponse;

type SuccessResponse = {
  success: boolean;
};

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SaveSubscriptionApiResponse | ErrorResponse>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const subscription = req.body as PushSubscription;
    await saveSubscription(subscription, session.user.id);
    return res.status(200).json({ success: true });
  }

  res.status(404).json({ error: 'Not found' });
}
