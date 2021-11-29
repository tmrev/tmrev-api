import { Request, Response } from 'express';
import { getReviewService } from '../../service/movieReviews/getReview.service';

export const getReviewController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    const uuid = req.params.uuid;

    if (!auth) {
      throw new Error('no auth provided');
    }

    if (!uuid) {
      throw new Error('no uuid provided');
    }

    if (typeof uuid !== 'string') {
      throw new Error('incorrect format');
    }

    const result = await getReviewService(auth, uuid);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
