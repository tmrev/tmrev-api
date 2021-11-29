import { Router } from 'express';
import { flushCacheController } from '../controllers/health/flushCache.Controller';
import { generalHealthController } from '../controllers/health/generalHealthController';
import asyncMiddleware from '../middleware/async.middleware';

const router: Router = Router();

router.get('/', asyncMiddleware(generalHealthController));

router.get('/flush', asyncMiddleware(flushCacheController));

export const healthRouter: Router = router;
