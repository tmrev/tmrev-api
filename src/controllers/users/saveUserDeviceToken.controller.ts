import { Request, Response } from "express";
import saveUserDeviceTokenService from "../../service/users/saveUserDeviceToken.service";

const saveUserDeviceTokenController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    const { body } = req;

    if (!auth) {
      throw new Error("no auth provided");
    }

    const result = await saveUserDeviceTokenService(
      auth,
      body.userId,
      body.deviceToken
    );

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default saveUserDeviceTokenController;
