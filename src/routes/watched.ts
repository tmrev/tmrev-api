import { Router } from "express";
import deleteWatchedController from "../controllers/movie/watched/deleteWatched.controller";
import createWatchedController from "../controllers/movie/watched/createWatched.controller";
import getWatchedController from "../controllers/movie/watched/getWatched.controller";
import updateWatchedController from "../controllers/movie/watched/updateWatched.controller";
import {
  createWatchedSchema,
  createWatchedValidation,
} from "../validation/watched";
import asyncMiddleware from "../middleware/async.middleware";

const router: Router = Router();

// watched is used when a user thumbs up/down a movie
router.post(
  "/watched",
  createWatchedSchema(),
  createWatchedValidation(),
  asyncMiddleware(createWatchedController)
);

router.get("/watched/:id", asyncMiddleware(getWatchedController));

router.put("/watched/:id", asyncMiddleware(updateWatchedController));

router.delete("/watched/:id", asyncMiddleware(deleteWatchedController));

const watchedRouter: Router = router;

export default watchedRouter;
