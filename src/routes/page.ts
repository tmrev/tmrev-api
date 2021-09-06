import { Router } from 'express';
import { metaScrap } from '../controllers/page/page.controller';
import asyncMiddleware from '../middleware/async.middleware';

const router: Router = Router();

router.get('/meta', asyncMiddleware(metaScrap));

export const PageRouter: Router = router;
