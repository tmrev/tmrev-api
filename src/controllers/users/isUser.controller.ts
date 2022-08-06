import { Request, Response } from 'express';
import { isUserService } from '../../service/users/isUser.service';

export const isUserController = async (req: Request, res: Response) => {
  try {
    const uid = req.params.uid;

    if (!uid) {
      throw new Error('no uid provided');
    }

    if (typeof uid !== 'string') {
      throw new Error('incorrect format');
    }

    console.log(uid)

    const result = await isUserService(uid);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
