import { Request, Response } from "express";
import unfollowUserV2Service from "../../../service/users/v2/unfollowUserV2.service";

const unfollowUserV2Controller = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const auth = req.headers.authorization as string;

    const result = await unfollowUserV2Service(uid, auth);

    if (!result.success) {
      throw new Error(result.error as any);
    }

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default unfollowUserV2Controller;
