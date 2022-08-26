/* eslint-disable no-unused-vars */

interface SearchMovieQuery {
  include_adult?: boolean;
  language: "en-US";
  page?: number;
  primay_release_year?: number;
  query: string;
  region?: string;
  year?: number;
}

// eslint-disable-next-line no-shadow
enum OriginalLanguage {
  En = "en",
  It = "it",
  Zh = "zh",
}

interface SearchMovie {
  adult: boolean;
  backdrop_path: null | string;
  genre_ids: number[];
  id: number;
  original_language: OriginalLanguage;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: null | string;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface SearchMovieResponse {
  page: number;
  results: SearchMovie[];
  total_pages: number;
  total_results: number;
}

export type {
  OriginalLanguage,
  SearchMovie,
  SearchMovieQuery,
  SearchMovieResponse,
};
