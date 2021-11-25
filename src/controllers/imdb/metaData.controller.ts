import { Request, Response } from 'express';
import { set } from '../..';
import { metaDataService } from '../../service/imdb/metaData.service';

export const metaDataController = async (req: Request, res: Response) => {
  try {
    const uuid = req.params.uuid as string | undefined;
    const type = req.params.type as 'title';

    if (!uuid) throw Error('uuid query is required');

    if (type !== 'title') throw Error('incorrect type use "title"');

    const meta = await metaDataService(
      `https://www.imdb.com/${type}/${uuid}/`,
      uuid
    );

    set(`${req.route.path}'/${req.params.uuid}'`, meta);

    res.send(meta);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
