import { Request, Response } from 'express';
import { createPollService } from '../../service/poll/createPoll.service';
import { getPollService } from '../../service/poll/getPoll.service';

export const getPollController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id

    if (!id || typeof id !== 'string') {
      throw new Error('no id provided');
    }

    const result = await getPollService(id)

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
