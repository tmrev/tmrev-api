/* eslint-disable no-use-before-define */

/* eslint-disable no-unused-vars */
interface Movie {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: null;
  budget: number;
  credits: Credits;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb?: IMDB;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  release_dates: ReleaseDates;
  revenue: number;
  reviews: Reviews;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface IMDB {
  _id: string;
  averageRating: string;
  endYear: string;
  genres: string;
  isAdult: string;
  numVotes: string;
  originalTitle: string;
  primaryTitle: string;
  runtimeMinutes: string;
  startYear: string;
  titleType: string;
  uid: string;
}

interface MovieQuery {
  append_to_response?: string;
  language?: string;
  movie_id: number;
}

interface Genre {
  id: number;
  name: string;
}

interface ProductionCompany {
  id: number;
  logo_path: null | string;
  name: string;
  origin_country: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface Credits {
  cast: Cast[];
  crew: Cast[];
}

interface Cast {
  adult: boolean;
  cast_id?: number;
  character?: string;
  credit_id: string;
  department?: string;
  gender: number;
  id: number;
  job?: string;
  known_for_department: string;
  name: string;
  order?: number;
  original_name: string;
  popularity: number;
  profile_path: null | string;
}

interface ReleaseDates {
  results: Result[];
}

export interface Result {
  iso_3166_1: string;
  release_dates: ReleaseDate[];
}

interface ReleaseDate {
  certification: string;
  note: string;
  release_date: Date;
  type: number;
}

interface Reviews {
  page: number;
  results: ReviewsResult[];
  total_pages: number;
  total_results: number;
}

interface ReviewsResult {
  author: string;
  author_details: AuthorDetails;
  content: string;
  created_at: Date;
  id: string;
  updated_at: Date;
  url: string;
}

interface AuthorDetails {
  avatar_path: string;
  name: string;
  rating: number;
  username: string;
}

interface SpokenLanguage {
  english_name: string;
  name: string;
}

export type {
  AuthorDetails,
  Cast,
  Credits,
  Genre,
  IMDB,
  Movie,
  MovieQuery,
  ProductionCompany,
  ProductionCountry,
  ReleaseDate,
  ReleaseDates,
  Reviews,
  ReviewsResult,
  SpokenLanguage,
};
