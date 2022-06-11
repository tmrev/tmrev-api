import { Request, Response } from 'express';
import { getMediaService } from '../../service/imdb/getMedia.service';

export const getMediaController= async(req: Request, res:Response) => {
    try {
        console.log(req.params, req.query)

        const uid = req.params.uid as string;

        if (!uid) throw Error('uid query is required');

        const result = await getMediaService(uid)

        res.send(result)


    } catch (error:any) {
        res.status(500).send(error.message)
    }
}