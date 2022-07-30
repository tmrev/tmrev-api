import { Request, Response } from 'express';
import { dailyBoxOffice } from '../../service/theNumbers/dailyBoxOffice.service';

export const dailyBoxOfficeController = async (req: Request, res:Response) => {
    try {
        const title = req.query.title as string
        const year = req.query.year as string 
        const tmdbID = req.query.id as string

        if(!title) throw Error('title query is required')
        if(!year) throw Error('year query is required')
        if(!tmdbID) throw Error('id query is required')

        const numbers = await dailyBoxOffice(title, year, Number(tmdbID))

        res.send(numbers)
    } catch (error) {
        res.status(500).send(error)
    }
}