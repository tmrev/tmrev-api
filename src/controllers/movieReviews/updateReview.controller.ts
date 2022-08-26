import { Request, Response } from "express";
import updateReviewService from "../../service/movieReviews/updateReview.service";

const updateReviewController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    const { body } = req;
    const { uuid } = req.params;

    if (!auth) {
      throw new Error("no auth provided");
    }

    if (!body) {
      throw new Error("no body provided");
    }

    if (!body.uuid) {
      throw new Error("must have movie uuid");
    }

    if (!uuid) {
      throw new Error("no uuid provided");
    }

    if (typeof uuid !== "string") {
      throw new Error("incorrect format");
    }

    const result = await updateReviewService(auth, uuid, body);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default updateReviewController;
