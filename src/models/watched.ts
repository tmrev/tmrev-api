export interface CreateWatchedPayload {
  liked: boolean;
  public: boolean;
  tmdbID: number;
}

export interface MongoWatchedPayload extends CreateWatchedPayload {
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
