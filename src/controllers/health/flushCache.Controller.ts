import { Request, Response } from 'express';
import { redisClient } from '../..';

export const flushCacheController = async (req: Request, res: Response) => {
  try {
    redisClient.flushdb(function (err, succeeded) {
      if (err) {
        throw new Error(err.message);
      }
      console.log(succeeded); // will be true if successfull
    });

    res.send('done');
  } catch (err) {
    res.status(500).send(err);
  }
};
