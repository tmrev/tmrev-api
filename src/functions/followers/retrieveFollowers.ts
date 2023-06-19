import { ObjectId } from "mongodb";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const retrieveFollowers = async (
  accountId: string,
  page = 1,
  pageSize = 10
) => {
  const userDB = client.db(tmrev.db).collection(tmrev.collection.users);

  const account = await userDB.findOne({ _id: new ObjectId(accountId) });

  if (!account) return null;

  const followers = await userDB
    .find({ following: new ObjectId(account._id) })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  const total = await userDB.countDocuments({
    following: new ObjectId(account._id),
  });

  return {
    total,
    followers,
    page,
    pageSize,
  };
};

export default retrieveFollowers;
