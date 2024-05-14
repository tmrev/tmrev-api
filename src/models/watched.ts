import { ObjectId } from "mongodb";
import { TimeStamp } from "./movieReviews";

export interface CreateWatchedPayload {
  liked: boolean;
  posterPath: string;
  public: boolean;
  title: string;
  tmdbID: number;
}

export interface MongoWatchedPayload extends CreateWatchedPayload {
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
  user?: ObjectId;
  userId: string;
}
