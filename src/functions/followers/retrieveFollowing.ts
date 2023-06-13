import { ObjectId } from "mongodb";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const retrieveFollowing = async (
  accountId: string,
  page = 1,
  pageSize = 10
) => {
  try {
    const userDB = client.db(tmrev.db).collection(tmrev.collection.users);

    const account = await userDB.findOne({ _id: new ObjectId(accountId) });

    if (!account) return null;

    const following = await userDB
      .find({ uuid: { $in: account.following } })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const total = await userDB.countDocuments({
      uuid: { $in: account.following },
    });

    console.log(following);

    return {
      total,
      following,
      page,
      pageSize,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default retrieveFollowing;
