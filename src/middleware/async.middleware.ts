/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction, RequestHandler } from "express";
import { validationResult } from "express-validator";
import { appCache } from "..";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export default (handler: AsyncRequestHandler): RequestHandler =>
  (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      if (appCache.has(req.params.movieId)) {
        return res.send(appCache.get(req.params.movieId));
      }
      return handler(req, res, next).catch(next);
    }
    const extractedErrors: { [x: string]: any }[] = [];
    errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
      errors: extractedErrors,
    });
  };
