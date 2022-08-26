export interface DiscoverMovieQuery {
  page: number;
}

export interface DiscoverMovieResult {
  adult: boolean;
  backdrop_path: null;
  genre_ids: number[];
  id: number;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: null;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface DiscoverMovie {
  page: number;
  results: DiscoverMovieResult[];
  total_pages: number;
  total_results: number;
}
