import { Router } from "express";
import getMediaController from "../controllers/imdb/getMedia.controller";

import asyncMiddleware from "../middleware/async.middleware";

const router: Router = Router();

router.get("/:uid", asyncMiddleware(getMediaController));

const imdbRouter: Router = router;

export default imdbRouter;
