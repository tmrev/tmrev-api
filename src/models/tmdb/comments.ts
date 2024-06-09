import { ObjectId } from "mongodb";
import { TimeStamp } from "../movieReviews";

enum PostTypes {
  'REVIEWS' = 'reviews',
  'COMMENTS' = 'comments',
  'LISTS' = 'watchlists',
}

type Post = {
  id: ObjectId,
  type: PostTypes,
  author: string,
}

type Vote = {
  upVote: string[],
  downVote: string[],
}

interface Comment {
  post: Post
  comment: string
  author: string
  createdAt: Date
  updatedAt: Date
  votes: Vote
}

export type {Vote, Post, Comment}

export {PostTypes}