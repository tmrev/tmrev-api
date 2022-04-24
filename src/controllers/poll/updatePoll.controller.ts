import { Request, Response } from 'express';
import { updatePollService } from '../../service/poll/updatePoll.service';

export const updatePollController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    const body = req.body;
    const id = req.params.id;

    if (!auth) {
      throw new Error('no auth provided');
    }

    if (!body) {
      throw new Error('no body provided');
    }


    if (!id) {
      throw new Error('no id provided');
    }

    if (typeof id !== 'string') {
      throw new Error('incorrect format');
    }

    const result = await updatePollService(auth,id, body)

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
