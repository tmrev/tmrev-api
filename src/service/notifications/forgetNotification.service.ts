import { ObjectId } from "mongodb";
import { forgetNotification } from "../../functions/notifications";

const forgetNotificationService = async (notificationId: string) => {
  try {
    const formattedId = new ObjectId(notificationId);

    await forgetNotification(formattedId);

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

export default forgetNotificationService;
