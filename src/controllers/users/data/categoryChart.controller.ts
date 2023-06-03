import { Request, Response } from "express";
import categoryChartService from "../../../service/users/data/categoryChart.service";

const categoryChartController = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const auth = req.headers.authorization || null;

    const result = await categoryChartService(uid, auth);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default categoryChartController;
