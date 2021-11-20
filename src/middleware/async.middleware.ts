import { Request, Response, NextFunction, RequestHandler } from 'express';
import { redisClient } from '..';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export default (handler: AsyncRequestHandler): RequestHandler => {
  return (req, res, next) => {
    let key = '';

    if (req.query.search) {
      key = `${req.route.path}'/${req.query.search}'`;
    } else if (req.params.uuid) {
      key = `${req.route.path}'/${req.params.uuid}'`;
    } else {
      key = req.route.path;
    }

    redisClient.get(key, (error, data) => {
      if (error) res.status(500).send(error);
      if (data !== null) {
        console.log('pulled cache');
        res.status(200).send(JSON.parse(data));
      } else {
        console.log('grabbing fresh');
        return handler(req, res, next).catch(next);
      }
    });
  };
};
