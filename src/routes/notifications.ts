import { Router } from "express";
import asyncMiddleware from "../middleware/async.middleware";
import retrieveNotificationController from "../controllers/notifications/retrieveNotification.controller";
import forgetNotificationController from "../controllers/notifications/forgetNotification.controller";
import readNotificationController from "../controllers/notifications/readNotification.controller";
import createNotificationController from "../controllers/notifications/createNotification.controller";
import {
  createNotificationValidation,
  getNotificationCountValidation,
  getNotificationV2Validation,
  retrieveNotificationValidation,
} from "../validation/notifications";
import getNotificationV2Controller from "../controllers/notifications/v2/getNotificationV2.service";
import getNotificationCountController from "../controllers/notifications/v2/getNotificationCount.service";
import readAllNotificationsController from "../controllers/notifications/v2/readAllNotifications.controller";

const router: Router = Router();

router.post("/:id/read", asyncMiddleware(readNotificationController));

router.post("/:id/forget", asyncMiddleware(forgetNotificationController));

router.get(
  "/v2",
  getNotificationV2Validation(),
  asyncMiddleware(getNotificationV2Controller)
);

router.get(
  "/count",
  getNotificationCountValidation(),
  asyncMiddleware(getNotificationCountController)
);

router.post(
  "/read",
  getNotificationCountValidation(),
  asyncMiddleware(readAllNotificationsController)
);

router.get(
  "/",
  retrieveNotificationValidation(),
  asyncMiddleware(retrieveNotificationController)
);

router.post(
  "/",
  createNotificationValidation(),
  asyncMiddleware(createNotificationController)
);

const notificationsRouter: Router = router;

export default notificationsRouter;
