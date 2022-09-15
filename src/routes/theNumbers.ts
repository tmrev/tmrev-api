import { Router } from "express";
import dailyBoxOfficeController from "../controllers/theNumbers/dailyBoxOffice.controller";

import asyncMiddleware from "../middleware/async.middleware";

const router: Router = Router();

router.get("/daily", asyncMiddleware(dailyBoxOfficeController));

const theNumbersRouter: Router = router;

export default theNumbersRouter;
