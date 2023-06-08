import { config } from "dotenv";
// eslint-disable-next-line import/no-unresolved
import { Message, getMessaging } from "firebase-admin/messaging";

config();

interface MessageParam {
  body: string;
  link: string;
  title: string;
}

const sendCommentMessage = async (topic: string, message: MessageParam) => {
  const { title, body, link } = message;
  // axios.post(
  //   `https://fcm.googleapis.com//v1/projects/${process.env.PROJECT_ID}/messages:send`,
  //   {
  //     message: {
  //       topic,
  //       notification: {
  //         title,
  //         body,
  //       },
  //       webpush: {
  //         fcm_options: {
  //           link,
  //         },
  //       },
  //     },
  //   },
  //   {
  //     headers: {
  //       Authorization: `bearer ${process.env.SERVER_KEY}`,
  //     },
  //   }
  // );

  const messages: Message = {
    topic,
    notification: {
      title,
      body,
    },
    webpush: {
      fcmOptions: {
        link,
      },
    },
  };

  const response = await getMessaging().send(messages);

  return response;
};

export default sendCommentMessage;
