import { Router } from "express";
import searchWatchListController from "../controllers/search/search.controller";
import asyncMiddleware from "../middleware/async.middleware";
import searchValidationRules from "../validation/search";

const router: Router = Router();

router.get(
  "/",
  searchValidationRules(),
  asyncMiddleware(searchWatchListController)
);

const searchRouter: Router = router;

export default searchRouter;
