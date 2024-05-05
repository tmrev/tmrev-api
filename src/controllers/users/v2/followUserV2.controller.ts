import { Request, Response } from "express";
import followUserV2Service from "../../../service/users/v2/followUserV2.service";

const followUserV2Controller = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const auth = req.headers.authorization as string;

    const result = await followUserV2Service(uid, auth);

    console.log(result);

    if (!result.success) {
      throw new Error(result.error as any);
    }

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default followUserV2Controller;
