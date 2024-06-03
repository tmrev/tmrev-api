import { Router } from "express";
import addMovieToWatchListController from "../controllers/watchLists/addMovieToWatchList.controller";
import createWatchListController from "../controllers/watchLists/createWatchList.controller";
import deleteWatchListController from "../controllers/watchLists/deleteWatchList.controller";
import getAllWatchListsController from "../controllers/watchLists/getAllWatchLists.controller";
import getWatchListController from "../controllers/watchLists/getWatchList.controller";
import movieWatchListCheckController from "../controllers/watchLists/movieWatchListCheck.controller";
import searchWatchListController from "../controllers/watchLists/searchWatchLists.controller";
import updateWatchListController from "../controllers/watchLists/updateWatchList.controller";
import asyncMiddleware from "../middleware/async.middleware";
import watchListUpdateValidationRules, {
  addMovieToWatchListValidationRules,
} from "../validation/watchList";

const router: Router = Router();

router.post(
  "/:listId",
  addMovieToWatchListValidationRules(),
  asyncMiddleware(addMovieToWatchListController)
);

router.get("/check/:uuid", asyncMiddleware(movieWatchListCheckController));

router.post("/", asyncMiddleware(createWatchListController));

router.get("/", asyncMiddleware(getAllWatchListsController));

router.get("/search", asyncMiddleware(searchWatchListController));

router.get("/:uuid", asyncMiddleware(getWatchListController));

router.delete("/:uuid", asyncMiddleware(deleteWatchListController));

router.put(
  "/:uuid",
  watchListUpdateValidationRules(),
  asyncMiddleware(updateWatchListController)
);

const watchListRouter: Router = router;

export default watchListRouter;
