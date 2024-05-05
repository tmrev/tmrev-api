// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const updateUserService = async (authToken: string, data: object) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);
    const db = client.db(tmrev.db).collection(tmrev.collection.users);

    const dbUser = await db.findOne({ email: user.email, uuid: user.uid });

    if (!dbUser) {
      throw new Error("no user found");
    }

    const newData = {
      ...dbUser,
      ...data,
      updatedAt: new Date(),
    };

    await db.updateOne(
      { email: user.email, uuid: user.uid },
      { $set: newData }
    );

    return "success";
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default updateUserService;
