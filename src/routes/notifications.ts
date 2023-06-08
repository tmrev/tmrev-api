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

router.post("/:id/read", asyncMiddleware(readNotificationController));

router.post("/:id/forget", asyncMiddleware(forgetNotificationController));

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
