import { Request, Response } from "express";
import getImdbMovie from "../../service/imdb/getMedia.service";

const getMediaController = async (req: Request, res: Response) => {
  try {
    const uid = req.params.uid as string;

    if (!uid) throw Error("uid query is required");

    const result = await getImdbMovie(uid);

    res.send(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export default getMediaController;
