import { Request, Response } from "express";
import deleteDeviceTokenService from "../../../service/users/deviceToken/deleteDeviceToken.service";
import controllerResponse from "../../../utils/controllerResponse";

const deleteDeviceTokenController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization as string;
    const { deviceToken } = req.body;

    console.log(auth, deviceToken, "deleteDeviceTokenController");

    const result = await deleteDeviceTokenService(auth, deviceToken);

    controllerResponse(res, result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default deleteDeviceTokenController;
