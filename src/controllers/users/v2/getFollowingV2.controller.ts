import { Request, Response } from "express";
import { GetFollowersV2Query } from "../../../service/users/v2/getFollowersV2.service";
import getFollowingV2Service from "../../../service/users/v2/getFollowingV2.service";

const getFollowingV2Controller = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const query = req.query as GetFollowersV2Query;
    const auth = req.headers.authorization as string;

    const result = await getFollowingV2Service(uid, query, auth);

    if (!result.success) {
      throw new Error(result.error as any);
    }

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default getFollowingV2Controller;
