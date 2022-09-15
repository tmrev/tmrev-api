import { Request, Response } from "express";

const generalHealthController = async (req: Request, res: Response) => {
  try {
    res.send("ok");
  } catch (err) {
    res.status(500).send(err);
  }
};

export default generalHealthController;
