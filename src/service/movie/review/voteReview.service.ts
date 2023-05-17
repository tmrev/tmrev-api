// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";

import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import { Vote } from "../../../models/tmdb/comments";

const hasUserVoted = (userId: ObjectId, votes: Vote) => {
  const upVoteMatch = votes.upVote.filter((vote) => vote.equals(userId));
  const downVoteMatch = votes.downVote.filter((vote) => vote.equals(userId));

  if (upVoteMatch.length) {
    return {
      type: "upVote",
      index: votes.upVote.findIndex((vote) => vote.equals(userId)),
    };
  }

  if (downVoteMatch.length) {
    return {
      type: "downVote",
      index: votes.downVote.findIndex((vote) => vote.equals(userId)),
    };
  }

  return undefined;
};

const voteReviewService = async (
  authToken: string,
  reviewId: string,
  vote: boolean
) => {
  try {
    const firebaseUser = await getAuth().verifyIdToken(authToken);

    const db = client.db(tmrev.db).collection(tmrev.collection.reviews);
    const userDb = client.db(tmrev.db).collection(tmrev.collection.users);

    const user = await userDb.findOne({ uuid: firebaseUser.uid });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const currentMovie = await db.findOne({
      _id: new ObjectId(reviewId),
    });

    if (!currentMovie) {
      return {
        success: false,
        error: "Movie Review not found",
      };
    }

    const voted = hasUserVoted(user._id, currentMovie.votes);

    if (voted && voted.type === "upVote") {
      currentMovie.votes.upVote.splice(voted.index, 1);
    } else if (voted && voted.type === "downVote") {
      (currentMovie.votes.downVote as any[]).splice(voted.index, 1);
    }

    if (vote) {
      currentMovie.votes.upVote.push(user._id);
    } else {
      currentMovie.votes.downVote.push(user._id);
    }

    await db.updateOne({ _id: new ObjectId(reviewId) }, { $set: currentMovie });

    const result = await db.findOne({
      _id: new ObjectId(reviewId),
    });

    return {
      success: true,
      body: result,
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default voteReviewService;
