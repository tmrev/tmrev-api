import { Request, Response } from "express";
import { validationResult } from "express-validator";
import batchLookUpService from "../../../service/import/imdb/batchLookUp.service";
import controllerResponse from "../../../utils/controllerResponse";

const batchLookUpController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    const { movieId } = req.body;

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: errors,
      });
    }

    const result = await batchLookUpService(movieId);

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default batchLookUpController;
