import {
  CreateNotification,
  createNotification,
} from "../../functions/notifications";

const createNotificationService = async (payload: CreateNotification) => {
  try {
    await createNotification(payload);

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

export default createNotificationService;
