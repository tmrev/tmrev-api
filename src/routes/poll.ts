import { Router } from "express";
import { createPollController } from "../controllers/poll/createPoll.controller";
import { getPollController } from "../controllers/poll/getPoll.controller";
import { updatePollController } from "../controllers/poll/updatePoll.controller";
import { votePollController } from "../controllers/poll/votePoll.controller";
import asyncMiddleware from "../middleware/async.middleware";

const router: Router = Router();

router.post('/', asyncMiddleware(createPollController))

router.get('/:id', asyncMiddleware(getPollController))

router.put('/:id', asyncMiddleware(updatePollController))

router.post('/vote/:id', asyncMiddleware(votePollController))

export const pollRouter: Router = router;
