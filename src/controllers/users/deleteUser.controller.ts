import { Request, Response } from "express";
import deleteUserService from "../../service/users/deleteUser.service";
import controllerResponse from "../../utils/controllerResponse";

const deleteUserController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization as string;

    const result = await deleteUserService(auth);

    controllerResponse(res, result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default deleteUserController;
