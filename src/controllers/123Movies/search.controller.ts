import { Request, Response } from "express";
import searchService from "../../service/123movies/search.service";

const searchController = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;

    if (!search) throw Error("search query is required");

    const meta = await searchService(
      `https://ww5.0123movie.net/search/${search}.html`
    );

    res.send(meta);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default searchController;
