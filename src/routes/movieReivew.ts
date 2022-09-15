import { Router } from "express";
import getAllReviewsController from "../controllers/movieReviews/getAllReviews.controller";
import asyncMiddleware from "../middleware/async.middleware";

const router: Router = Router();

router.get("/all", asyncMiddleware(getAllReviewsController));

const movieRouter: Router = router;

export default movieRouter;
