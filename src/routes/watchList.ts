import { Router } from 'express';
import { addMovieToWatchListController } from '../controllers/watchLists/addMovieToWatchList.controller';
import { createWatchListController } from '../controllers/watchLists/createWatchList.controller';
import { deleteWatchListController } from '../controllers/watchLists/deleteWatchList.controller';
import { getAllWatchListsController } from '../controllers/watchLists/getAllWatchLists.controller';
import { getWatchListController } from '../controllers/watchLists/getWatchList.controller';
import { updateWatchListController } from '../controllers/watchLists/updateWatchList.controller';
import asyncMiddleware from '../middleware/async.middleware';

const router: Router = Router();

router.post('/:listId', asyncMiddleware(addMovieToWatchListController));

router.post('/', asyncMiddleware(createWatchListController));

router.get('/', asyncMiddleware(getAllWatchListsController));

router.get('/:uuid', asyncMiddleware(getWatchListController));

router.delete('/:uuid', asyncMiddleware(deleteWatchListController));

router.put('/:uuid', asyncMiddleware(updateWatchListController));

export const WatchListRouter: Router = router;
