import { Router } from "express";
import generalHealthController from "../controllers/health/generalHealthController";
import asyncMiddleware from "../middleware/async.middleware";

const router: Router = Router();

router.get("/", asyncMiddleware(generalHealthController));

const healthRouter: Router = router;

export default healthRouter;
