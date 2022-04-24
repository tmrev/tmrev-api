import { Request, Response } from 'express';
import { followerFeedService } from '../../service/users/followerFeed.service';

export const followerFeedController = async (req: Request, res: Response) => {
    try {
        const auth = req.headers.authorization;
        const limit = req.query.limit;

        if (!auth) {
            throw new Error('no auth provided');
        }

        if (!limit) {
            throw new Error('no limit provided');
        }

        const result = await followerFeedService(Number(limit), auth)

        res.send(result)
    } catch (err: any) {   
        res.status(500).send(err.message)
    }
}