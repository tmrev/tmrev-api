import { Request, Response } from "express";
import followUserService from "../../service/users/followUser.service";

const followUserController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    const { uid } = req.params;

    if (!auth) {
      throw new Error("no auth provided");
    }

    if (!uid) {
      throw new Error("no uid provided");
    }

    const result = await followUserService(auth, uid);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default followUserController;
