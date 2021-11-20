import { Request, Response } from 'express';
import { set } from '../..';
import { metaDataService } from '../../service/imdb/metaData.service';
import { movePosterService } from '../../service/imdb/moviePoster.service';

export const moviePosterController = async (req: Request, res: Response) => {
  try {
    const uuid = req.params.uuid as string | undefined;

    console.log(uuid);

    if (!uuid) throw Error('uuid query is required');

    const meta = await movePosterService(uuid);

    // set(`${req.route.path}'/${req.params.uuid}'`, meta);

    res.send(meta);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
