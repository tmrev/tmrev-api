import { Request, Response } from 'express';
import { createReviewService } from '../../service/movieReviews/createReview.service';

export const createReviewController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    const body = req.body;

    if (!auth) {
      throw new Error('no auth provided');
    }

    if (!body) {
      throw new Error('no body provided');
    }

    if (!body.uuid) {
      throw new Error('must have movie uuid');
    }

    const result = await createReviewService(auth, body);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
