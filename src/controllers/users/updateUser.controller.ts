import { Request, Response } from 'express';
import { updateUserService } from '../../service/users/updateUser.service';

export const updateUserController = async (req: Request, res: Response) => {
  try {
     const auth = req.headers.authorization;

     if (!auth) {
      throw new Error('no auth provided');
    }

    const result = await updateUserService(auth, req.body);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
