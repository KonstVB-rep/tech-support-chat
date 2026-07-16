import webpush from "web-push";
import { prisma } from "@/prisma/prisma-client";

interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

export const sendPushToProfile = async (
  profileId: string,
  payload: PushPayload,
) => {
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    select: { pushEnabled: true, pushSubscription: true },
  });

  if (!profile?.pushEnabled || !profile.pushSubscription) return;

  try {
    const subscription =
      profile.pushSubscription as unknown as webpush.PushSubscription;

    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (error: unknown) {
    if (error instanceof webpush.WebPushError && error.statusCode === 410) {
      await prisma.profile.update({
        where: { id: profileId },
        data: {
          pushEnabled: false,
          pushSubscription: undefined,
        },
      });
      console.log(`🗑️ Удалена невалидная push-подписка: ${profileId}`);
    } else {
      console.error(`❌ Push ошибка для ${profileId}:`, error);
    }
  }
};
