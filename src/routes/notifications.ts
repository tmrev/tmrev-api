import { Router } from "express";
import asyncMiddleware from "../middleware/async.middleware";
import retrieveNotificationController from "../controllers/notifications/retrieveNotification.controller";
import forgetNotificationController from "../controllers/notifications/forgetNotification.controller";
import readNotificationController from "../controllers/notifications/readNotification.controller";
import createNotificationController from "../controllers/notifications/createNotification.controller";
import {
  createNotificationValidation,
  retrieveNotificationValidation,
} from "../validation/notifications";

const router: Router = Router();

// marks notifications as read
router.post("/:id/read", asyncMiddleware(readNotificationController));

// marks notification as un-read
// TODO: rename this endpoint
router.post("/:id/forget", asyncMiddleware(forgetNotificationController));

// returns all new notifications
router.get(
  "/",
  retrieveNotificationValidation(),
  asyncMiddleware(retrieveNotificationController)
);

// creates notification
// TODO: remove this endpoint not needed
router.post(
  "/",
  createNotificationValidation(),
  asyncMiddleware(createNotificationController)
);

const notificationsRouter: Router = router;

export default notificationsRouter;
