import { Request, Response } from "express";
import isDeviceTokenSavedService from "../../../service/users/deviceToken/isDeviceTokenSaved.service";
import controllerResponse from "../../../utils/controllerResponse";

const isDeviceTokenSavedController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization as string;
    const { deviceToken } = req.body;

    const result = await isDeviceTokenSavedService(auth, deviceToken);

    controllerResponse(res, result);
  } catch (err: any) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

export default isDeviceTokenSavedController;
