import { Response } from "express";

const controllerResponse = (res: Response, result: any) => {
  if (!result.success) {
    res.status(500).send({
      success: false,
      error: result.error,
    });
  } else {
    res.send(result);
  }
};

export default controllerResponse;
