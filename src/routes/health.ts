import { Router } from 'express';
import { generalHealthController } from '../controllers/health/generalHealthController';
import asyncMiddleware from '../middleware/async.middleware';

const router: Router = Router();

router.get('/', asyncMiddleware(generalHealthController));

export const healthRouter: Router = router;
