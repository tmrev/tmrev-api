import { Request, Response } from "express";
import votePollService from "../../service/poll/votePoll.service";

const votePollController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    const { category } = req.query;
    const { id } = req.params;

    if (!auth) {
      throw new Error("no auth provided");
    }

    if (!category) {
      throw new Error("no category provided");
    }

    if (typeof category !== "string") {
      throw new Error("category not valid");
    }

    if (!id) {
      throw new Error("no id provided");
    }

    if (typeof id !== "string") {
      throw new Error("incorrect format");
    }

    const result = await votePollService(auth, id, category);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default votePollController;
