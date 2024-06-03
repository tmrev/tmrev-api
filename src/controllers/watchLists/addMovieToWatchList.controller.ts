import { Request, Response } from "express";
import AddMovieToWatchList from "../../service/watchLists/addMovieToWatchList.service";
import controllerResponse from "../../utils/controllerResponse";

const addMovieToWatchListController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    const { listId } = req.params;

    const result = await AddMovieToWatchList(auth!, listId, req.body.data);

    console.log(result);

    controllerResponse(res, result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default addMovieToWatchListController;
