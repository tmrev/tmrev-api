import { Router } from 'express';
import { metaDataController } from '../controllers/imdb/metaData.controller';
import { popularMoviesController } from '../controllers/imdb/popularMovies';
import { searchController } from '../controllers/imdb/search.controller';

import asyncMiddleware from '../middleware/async.middleware';

const router: Router = Router();

router.get('/popular', asyncMiddleware(popularMoviesController));

router.get('/search', asyncMiddleware(searchController));

router.get('/:type/:uuid', asyncMiddleware(metaDataController));

export const ImdbRouter: Router = router;
