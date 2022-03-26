import { Request, Response } from 'express';
import { getUserTopMoviesService } from '../../service/users/getUserTopMovies.service';


export const getUserTopMoviesController = async (req: Request, res: Response) => {
    try {
      
    const { uuid } = req.params;
    const { sort, limit } = req.query
        
    if (!uuid) {
      throw new Error('no uid provided');
    }

    if (typeof uuid !== 'string') {
      throw new Error('incorrect format');
    }

    if (sort !== '-1' && sort !== '1') {
      throw new Error('invalid sort')
    }    
        
    const result = await getUserTopMoviesService(Number(limit) || 10, sort, uuid)

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
