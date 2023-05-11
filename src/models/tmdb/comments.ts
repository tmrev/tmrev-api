import { ObjectId } from "mongodb";
import { TimeStamp } from "../movieReviews";

enum PostTypes {
  'REVIEWS' = 'reviews'
}

type Post = {
  id: ObjectId,
  type: PostTypes,
  author: ObjectId,
}

type Vote = {
  upVote: ObjectId[],
  downVote: ObjectId[],
}

interface Comment {
  post: Post
  comment: string
  author: ObjectId
  createdAt: TimeStamp
  updatedAt: TimeStamp | null
  votes: Vote
}

export type {Vote, Post, Comment}

export {PostTypes}