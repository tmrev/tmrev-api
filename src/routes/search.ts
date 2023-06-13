import { Router } from "express";
import searchWatchListController from "../controllers/search/search.controller";
import asyncMiddleware from "../middleware/async.middleware";
import searchValidationRules from "../validation/search";

const router: Router = Router();

// used for search through watchlist, users and review. Also searches tmdb
// TODO: remove tmdb search and separate concerns
router.get(
  "/",
  searchValidationRules(),
  asyncMiddleware(searchWatchListController)
);

const searchRouter: Router = router;

export default searchRouter;
