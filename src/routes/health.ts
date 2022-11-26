import { Router } from "express";
import clearCacheController from "../controllers/health/clearCacheController";
import generalHealthController from "../controllers/health/generalHealthController";
import asyncMiddleware from "../middleware/async.middleware";

const router: Router = Router();

router.get("/", asyncMiddleware(generalHealthController));

router.get("/clean", asyncMiddleware(clearCacheController));

const healthRouter: Router = router;

export default healthRouter;
