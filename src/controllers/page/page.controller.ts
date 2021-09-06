import { Request, Response } from 'express';
import { metaScrapService } from '../../service/page/metaScrap.service';

export const metaScrap = async (req: Request, res: Response) => {
  try {
    const url = req.body.url as string | undefined;

    if (!url) throw Error('URL is required');

    const meta = await metaScrapService(url);

    res.send(meta);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
