import { Router } from 'express';
import { metaDataController } from '../controllers/rottenTomatoes/metaData.controller';
import { searchController } from '../controllers/rottenTomatoes/search.controller';
import asyncMiddleware from '../middleware/async.middleware';

const router: Router = Router();

router.get('/search', asyncMiddleware(searchController));

router.get('/:type/:uuid', asyncMiddleware(metaDataController));

export const RottenRouter: Router = router;
