import { Request, Response } from "express";
import getUserLeaderBoardService from "../../service/users/getUserLeaderBoard.service";

const getUserLeaderBoardController = async (req: Request, res: Response) => {
  try {
    const result = await getUserLeaderBoardService();

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default getUserLeaderBoardController;
