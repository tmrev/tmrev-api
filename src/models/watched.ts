import { ObjectId } from "mongodb";

export interface CreateWatchedPayload {
  liked: boolean;
  public: boolean;
  tmdbID: number;
}

export interface MongoWatchedPayload extends CreateWatchedPayload {
  createdAt: Date;
  updatedAt: Date;
  user?: ObjectId;
  userId: string;
}
