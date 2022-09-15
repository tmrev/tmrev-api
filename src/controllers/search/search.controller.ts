import { Request, Response } from "express";
import { validationResult } from "express-validator";
import searchService from "../../service/search/search.service";
import controllerResponse from "../../utils/controllerResponse";

const searchWatchListController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    const { q } = req.query;

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: errors,
      });
    }

    const result = await searchService(q as string);

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default searchWatchListController;
