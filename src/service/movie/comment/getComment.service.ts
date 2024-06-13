import { ObjectId, Document } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";

const getCommentService = async (commentId: string) => {
  try {
    const commentsDB = client
      .db(tmrev.db)
      .collection(tmrev.collection.comments);

    const initComment = await commentsDB.findOne({
      _id: new ObjectId(commentId),
    });

    if (!initComment) {
      return {
        success: false,
        error: "Comment not found",
      };
    }

    const pipeline: Document[] = [
      {
        $match: {
          _id: new ObjectId(commentId),
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
        $lookup: {
          from: initComment.post.type,
          localField: "post.id",
          foreignField: "_id",
          as: "postDetails",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $unwind: "$postDetails",
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
      {
        $project: {
          _id: 1,
          comment: 1,
          createdAt: 1,
          updatedAt: 1,
          post: 1,
          votes: 1,
          replies: 1,
          user: {
            _id: 1,
            uuid: 1,
            username: 1,
            photoUrl: 1,
          },
          postDetails: {
            // this will vary depending on the type of post
            _id: 1,
            userId: 1,
            averagedAdvancedScore: 1,
            notes: 1,
            tmdbID: 1,
            advancedScore: 1,
            public: 1,
            title: 1,
            votes: 1,
            createdAt: 1,
            updatedAt: 1,
            reviewedDate: 1,
            comment: 1,
            post: 1,
            postType: initComment.post.type,
          },
        },
      },
    ];

    const comment = await commentsDB.aggregate(pipeline).toArray();

    console.log(comment);

    if (comment.length === 0) {
      return {
        success: false,
        error: "Comment not found",
      };
    }

    return {
      success: true,
      body: comment[0],
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default getCommentService;
