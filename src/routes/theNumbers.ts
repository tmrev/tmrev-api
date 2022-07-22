import { Router } from 'express';
import { dailyBoxOfficeController } from '../controllers/theNumbers/dailyBoxOffice.controller';

import asyncMiddleware from '../middleware/async.middleware';

const router: Router = Router();

router.get('/daily', asyncMiddleware(dailyBoxOfficeController));

export const theNumbersRouter: Router = router;
