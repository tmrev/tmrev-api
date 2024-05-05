/* eslint-disable no-use-before-define */
import { ObjectId } from "mongodb";
import { Vote } from "./tmdb/comments";

export interface CreateMoviePayload {
  advancedScore: AdvancedScore;
  moviePoster: string;
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
  moviePoster: string;
  notes: string;
  public: boolean;
  release_date: string;
  reviewedDate: string;
  title: string;
  tmdbID: number;
  updatedAt: TimeStamp;
  user?: ObjectId;
  userId: string;
  votes: Vote;
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

export type TimeStamp = {
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

export type AdvancedScoreUnion =
  | "acting"
  | "characters"
  | "cinematography"
  | "climax"
  | "ending"
  | "music"
  | "personalScore"
  | "plot"
  | "theme"
  | "visuals";

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

export type GetMovieReviewSortBy =
  | "date.asc"
  | "date.desc"
  | "avgScore.asc"
  | "avgScore.desc"
  | "acting.asc"
  | "acting.desc"
  | "characters.asc"
  | "characters.desc"
  | "cinematography.asc"
  | "cinematography.desc"
  | "climax.asc"
  | "climax.desc"
  | "ending.asc"
  | "ending.desc"
  | "music.asc"
  | "music.desc"
  | "personalScore.asc"
  | "personalScore.desc"
  | "plot.asc"
  | "plot.desc"
  | "theme.asc"
  | "theme.desc"
  | "visuals.asc"
  | "visuals.desc";

export interface GetMovieReviewQuery {
  count?: number;
  include_user_review?: string;
  skip?: number;
  sort_by?: GetMovieReviewSortBy;
}
