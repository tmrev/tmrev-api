import { Request, Response } from 'express';
import { createPollService } from '../../service/poll/createPoll.service';

export const createPollController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    const body = req.body;

    if (!auth) {
      throw new Error('no auth provided');
    }

    if (!body) {
      throw new Error('no body provided');
    }

    if (!body.title) {
      throw new Error('must have movie title');
    }

    const result = await createPollService(auth, body)

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
