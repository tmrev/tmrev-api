import { getMessaging } from "firebase-admin/messaging";

const sendNotification = async (
  deviceToken: string[],
  title: string,
  body: string,
  linkUrl: string
) => {
  const message = {
    notification: {
      title,
      body,
    },
    data: {
      url: linkUrl,
    },
    tokens: deviceToken,
  };

  await getMessaging().sendMulticast(message);
};

export default sendNotification;
