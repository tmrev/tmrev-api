import { Router } from "express";
import dailyBoxOfficeController from "../controllers/theNumbers/dailyBoxOffice.controller";

import asyncMiddleware from "../middleware/async.middleware";

const router: Router = Router();

// TODO: move this to https://github.com/tmrev/kubrick
// scrapes the numbers and returns box office stats
router.get("/daily", asyncMiddleware(dailyBoxOfficeController));

const theNumbersRouter: Router = router;

export default theNumbersRouter;
