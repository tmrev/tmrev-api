// eslint-disable-next-line import/no-unresolved
import { getMessaging } from "firebase-admin/messaging";

const subscribeTopic = async (topic: string, deviceTokens?: string[]) => {
  if (!deviceTokens || !deviceTokens.length) return null;

  try {
    const response = await getMessaging().subscribeToTopic(deviceTokens, topic);

    return response;
  } catch (error) {
    return null;
  }
};

export default subscribeTopic;
