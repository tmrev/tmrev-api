import { Request, Response } from "express";
import metaScrapService from "../../service/page/metaScrap.service";

const metaScrap = async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string | undefined;

    if (!url) throw Error("URL is required");

    const meta = await metaScrapService(url);

    res.send(meta);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default metaScrap;
