import { Router } from "express";
import searchController from "../controllers/fMovies/search.controller";

import asyncMiddleware from "../middleware/async.middleware";

const router: Router = Router();

router.get("/search", asyncMiddleware(searchController));

const fMoviesRouter: Router = router;

export default fMoviesRouter;
