import { Request, Response } from 'express';

export const generalHealthController = async (req: Request, res: Response) => {
  try {
    res.send('ok');
  } catch (err) {
    res.status(500).send(err);
  }
};
