import { Router } from "express";
import searchController from "../controllers/123Movies/search.controller";

import asyncMiddleware from "../middleware/async.middleware";

const router: Router = Router();

router.get("/search", asyncMiddleware(searchController));

const numberMoviesRouter: Router = router;

export default numberMoviesRouter;
