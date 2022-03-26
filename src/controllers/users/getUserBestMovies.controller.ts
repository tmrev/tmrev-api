import { Request, Response } from 'express';
import { GetUserCategoryMoviesService } from '../../service/users/getUserCategoryMovies.service';


export const getUserCategoryController = async (req: Request, res: Response) => {
    try {
      
    const { category, uuid } = req.params;
    const { sort, limit } = req.query
        
    if (!uuid) {
      throw new Error('no uid provided');
    }

    if (typeof uuid !== 'string') {
      throw new Error('incorrect format');
    }

    if (!category) {
      throw new Error('no category provided');
    }
        
    if (sort !== '-1' && sort !== '1') {
      throw new Error('invalid sort')
    }    
        

    if (typeof category !== 'string') {
      throw new Error('incorrect ${category} format');
    }


    const result = await GetUserCategoryMoviesService(Number(limit) || 10, sort, category as any, uuid)

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
