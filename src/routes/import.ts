import { Router } from "express";

import asyncMiddleware from "../middleware/async.middleware";
import { movieBatchValidation } from "../validation/movies";
import batchLookUpController from "../controllers/import/imdb/batchLookUp.controller";

const router: Router = Router();

router.post(
  "/imdb",
  movieBatchValidation(),
  asyncMiddleware(batchLookUpController)
);

const importRouter: Router = router;

export default importRouter;
