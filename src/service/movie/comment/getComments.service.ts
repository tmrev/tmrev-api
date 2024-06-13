import { Document, ObjectId } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";

const getCommentsService = async (postId: string) => {
  try {
    const commentsDB = client
      .db(tmrev.db)
      .collection(tmrev.collection.comments);

    const pipeline: Document[] = [
      {
        $match: {
          "post.id": new ObjectId(postId),
        },
      },
      {
        $lookup: {
          from: tmrev.collection.users,
          localField: "author",
          foreignField: "uuid",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,
          comment: 1,
          createdAt: 1,
          updatedAt: 1,
          post: 1,
          votes: 1,
          user: {
            _id: 1,
            uuid: 1,
            username: 1,
            photoUrl: 1,
          },
        },
      },
      {
        $lookup: {
          from: tmrev.collection.comments,
          localField: "_id",
          foreignField: "post.id",
          as: "replies",
        },
      },
      {
        $addFields: {
          replies: { $size: "$replies" },
        },
      },
    ];

    const comments = await commentsDB.aggregate(pipeline).toArray();

    return {
      success: true,
      body: comments,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default getCommentsService;
