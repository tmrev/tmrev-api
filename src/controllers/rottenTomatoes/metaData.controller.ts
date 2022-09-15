import { Request, Response } from "express";

import metaDataService from "../../service/rottenTomatoes/metaData.service";

const metaDataController = async (req: Request, res: Response) => {
  try {
    const uuid = req.params.uuid as string | undefined;
    const type = req.params.type as "m" | "tv";

    if (!uuid) throw Error("uuid query is required");

    if (type !== "m" && type !== "tv")
      throw Error('incorrect type use either "m" or "tv"');

    const meta = await metaDataService(
      `https://www.rottentomatoes.com/${type}/${uuid}`,
      uuid
    );

    res.send(meta);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default metaDataController;
