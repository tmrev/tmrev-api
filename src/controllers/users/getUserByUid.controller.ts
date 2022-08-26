import { Request, Response } from "express";
import getUserByUidService from "../../service/users/getUserByUid.service";

const getUserByUidController = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      throw new Error("no uid provided");
    }

    if (typeof uid !== "string") {
      throw new Error("incorrect format");
    }

    const result = await getUserByUidService(uid);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default getUserByUidController;
