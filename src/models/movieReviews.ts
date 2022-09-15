/* eslint-disable no-use-before-define */
import { ObjectId } from "mongodb";

export interface CreateMoviePayload {
  advancedScore: AdvancedScore;
  notes: string;
  public: boolean;
  release_date: string;
  reviewedDate: string;
  title: string;
  tmdbID: number;
}

export interface MongoMoviePayload {
  advancedScore: AdvancedScore;
  averagedAdvancedScore: number;
  createdAt: TimeStamp;
  notes: string;
  public: boolean;
  release_date: string;
  reviewedDate: string;
  title: string;
  tmdbID: number;
  updatedAt: TimeStamp;
  user?: ObjectId;
  userId: string;
}

export interface MovieDocument {
  _id: ObjectId;
  advancedScore: AdvancedScore | null;
  averagedAdvancedScore: number | null;
  createdAt: TimeStamp;
  imdb: IMDBMovie | null;
  rotten: RottenMovie | null;
  simpleScore: number | null;
  title: string;
  updatedAt: TimeStamp;
  uuid: string;
}

type TimeStamp = {
  nanoseconds: number;
  seconds: number;
};

export type AdvancedScore = {
  acting: number;
  characters: number;
  cinematography: number;
  climax: number;
  ending: number;
  music: number;
  personalScore: number;
  plot: number;
  theme: number;
  visuals: number;
};

type RottenMovie = {
  audiencescore: string;
  audiencestate: string;
  cast: Cast[];
  info: Info;
  movieInfo: MovieInfo;
  movieSynopsis: string;
  photos: string[];
  poster: string;
  rating: string;
  title: string;
  tomatometerscore: string;
  tomatometerstate: string;
  uuid: string;
  whereToWatch: WhereToWatch[];
};

type Cast = {
  character: string;
  img: string;
  name: string;
};

type Info = {
  duration: string;
  year: string;
};

type MovieInfo = {
  "aspect-ratio": string;
  "box-office (gross usa)": string;
  director: string;
  distributor: string;
  genre: string[];
  "original-language": string;
  producer: string[];
  rating: string;
  "release-date (streaming)": string;
  "release-date (theaters)": string;
  runtime: string;
  "sound-mix": string;
  writer: string[];
};

type WhereToWatch = {
  availability: string;
  provider: string;
};

type IMDBMovie = {
  genre: string[];
  metaScore: string;
  movieSynopsis: string;
  poster: string;
  rating: string;
  score: string;
  title: string;
  uuid: string;
};
