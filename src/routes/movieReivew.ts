import { Router } from 'express';
import { createReviewController } from '../controllers/movieReviews/createReview.controller';
import { deleteReviewController } from '../controllers/movieReviews/deleteReview.controller';
import { getAllMovieReviewsController } from '../controllers/movieReviews/getAllMovieReviews.controller';
import { getAllReviewsController } from '../controllers/movieReviews/getAllReviews.controller';
import { getReviewController } from '../controllers/movieReviews/getReview.controller';
import { updateReviewController } from '../controllers/movieReviews/updateReview.controller';
import asyncMiddleware from '../middleware/async.middleware';

const router: Router = Router();

router.post('/', asyncMiddleware(createReviewController));

router.get('/all/:uuid', asyncMiddleware(getAllMovieReviewsController))

router.get('/all', asyncMiddleware(getAllReviewsController));

router.get('/:uuid', asyncMiddleware(getReviewController));

router.delete('/:uuid', asyncMiddleware(deleteReviewController));

router.put('/:uuid', asyncMiddleware(updateReviewController));

export const MovieRouter: Router = router;
