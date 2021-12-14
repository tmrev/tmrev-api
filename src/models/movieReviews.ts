import { ObjectId } from 'mongodb';

export interface CreateMoviePayload {
  advancedScore: AdvancedScore | null;
  averagedAdvancedScore: number | null;
  rotten: RottenMovie | null;
  imdb: IMDBMovie | null;
  simpleScore: number | null;
}

export interface MovieDocument {
  _id: ObjectId;
  uuid: string;
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
  title: string;
  advancedScore: AdvancedScore | null;
  averagedAdvancedScore: number | null;
  rotten: RottenMovie | null;
  imdb: IMDBMovie | null;
  simpleScore: number | null;
}

type TimeStamp = {
  seconds: number;
  nanoseconds: number;
};

type AdvancedScore = {
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
  uuid: string;
  audiencescore: string;
  rating: string;
  audiencestate: string;
  tomatometerstate: string;
  tomatometerscore: string;
  title: string;
  info: Info;
  movieSynopsis: string;
  poster: string;
  cast: Cast[];
  movieInfo: MovieInfo;
  whereToWatch: WhereToWatch[];
  photos: string[];
};

type Cast = {
  name: string;
  character: string;
  img: string;
};

type Info = {
  year: string;
  duration: string;
};

type MovieInfo = {
  rating: string;
  genre: string[];
  'original-language': string;
  director: string;
  producer: string[];
  writer: string[];
  'release-date (theaters)': string;
  'release-date (streaming)': string;
  'box-office (gross usa)': string;
  runtime: string;
  distributor: string;
  'sound-mix': string;
  'aspect-ratio': string;
};

type WhereToWatch = {
  provider: string;
  availability: string;
};

type IMDBMovie = {
  uuid: string;
  title: string;
  score: string;
  metaScore: string;
  rating: string;
  movieSynopsis: string;
  genre: string[];
  poster: string;
};
