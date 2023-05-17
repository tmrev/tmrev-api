import { Request, Response } from "express";
import controllerResponse from "../../../utils/controllerResponse";
import voteReviewService from "../../../service/movie/review/voteReview.service";

const voteReviewController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization as string;
    const { body } = req;
    const { id } = req.params;

    const result = await voteReviewService(auth, id, body.vote);

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default voteReviewController;
