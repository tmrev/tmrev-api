import { Router } from 'express';
import { getUserByUidController } from '../controllers/users/getUserByUid.controller';
import { getUserLeaderBoardController } from '../controllers/users/getUserLeaderBoard.controller';
import asyncMiddleware from '../middleware/async.middleware';

const router: Router = Router();

router.get('/leaderboard', asyncMiddleware(getUserLeaderBoardController))

router.get('/:uid', asyncMiddleware(getUserByUidController));

export const userRouter: Router = router;
