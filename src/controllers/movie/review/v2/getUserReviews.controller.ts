import { Request, Response } from "express";
import { validationResult } from "express-validator";
import controllerResponse from "../../../../utils/controllerResponse";
import GetUserReviewsService, {
  UserReviewsQueryType,
} from "../../../../service/movie/review/v2/getUserReviews.service";

const getUserReviewsController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    const auth = req.headers.authorization as string;
    const { userId } = req.params;

    const query: UserReviewsQueryType = {
      ...(req.query as any),
    };

    if (req.query.advancedScore) {
      const [category, score] = String(req.query.advancedScore).split(".");
      query.advancedScore = {
        category,
        score: Number(score),
      };
    }

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: errors,
      });
    }

    const result = await GetUserReviewsService(userId, query, auth);

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default getUserReviewsController;
