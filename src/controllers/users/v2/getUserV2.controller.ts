import { Request, Response } from "express";
import getUserV2Service from "../../../service/users/v2/getUserV2.service";

const getUserV2Controller = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const auth = req.headers.authorization;

    const result = await getUserV2Service(uid, auth);

    if (!result.success) {
      throw new Error(result.error);
    }

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default getUserV2Controller;
