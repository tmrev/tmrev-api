import { ObjectId } from "mongodb";
import { readNotification } from "../../functions/notifications";

const readNotificationService = async (notificationId: string) => {
  try {
    const formattedId = new ObjectId(notificationId);

    await readNotification(formattedId);

    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default readNotificationService;
