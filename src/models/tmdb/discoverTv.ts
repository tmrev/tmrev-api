export interface DiscoverTvQuery {
  page: number;
}

export interface Result {
  backdrop_path: null;
  first_air_date: Date;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

export interface DiscoverTv {
  page: number;
  results: Result[];
  total_pages: number;
  total_results: number;
}
