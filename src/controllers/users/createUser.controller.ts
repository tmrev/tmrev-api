import { Request, Response } from 'express';
import { createUserService } from '../../service/users/createUser.service';

export const createUserController = async (req: Request, res: Response) => {
  try {
     const auth = req.headers.authorization;
     const body = req.body

     console.log(req)

     if (!auth) {
      throw new Error('no auth provided');
    }

    const result = await createUserService(auth, body);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
