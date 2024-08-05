import { Request, Response } from "express";
import getUserReviewsByActorService from "../../../service/movie/review/getReviewsByActor.service";
import controllerResponse from "../../../utils/controllerResponse";

const getReviewsByActorController = async (req: Request, res: Response) => {
  try {
    const { actorId, userId } = req.params;

    const result = await getUserReviewsByActorService(+actorId, userId);

    controllerResponse(res, result);
  } catch (error) {
    res.status(500).send(error);
  }
};

export default getReviewsByActorController;
