import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";

const deleteCommentService = async (commentId: string, authToken: string) => {
  try {
    const firebaseUser = await getAuth().verifyIdToken(authToken);

    const userDB = client.db(tmrev.db).collection(tmrev.collection.users);
    const commentDB = client.db(tmrev.db).collection(tmrev.collection.comments);

    const user = await userDB.findOne({ uuid: firebaseUser.uid });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const comment = await commentDB.findOne({ _id: new ObjectId(commentId) });

    if (!comment) {
      return {
        success: false,
        error: "Comment not found",
      };
    }

    if (comment.author !== user.uuid) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    await commentDB.deleteOne({ _id: new ObjectId(commentId) });

    await commentDB.updateMany(
      { "post.id": new ObjectId(commentId) },
      { $set: { "post.delete": true } }
    );

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default deleteCommentService;
