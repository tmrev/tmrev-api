import { Request, Response } from "express";
import searchUserService from "../../service/users/searchUser.service";

const searchUserController = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q) {
      throw new Error("no search provided");
    }

    if (typeof q !== "string") {
      throw new Error("incorrect format");
    }

    const result = await searchUserService(q);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default searchUserController;
