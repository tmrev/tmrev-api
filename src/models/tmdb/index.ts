import type {
  DiscoverMovie,
  DiscoverMovieQuery,
  DiscoverMovieResult,
} from "./discoverMovie";
import type { DiscoverTv, DiscoverTvQuery } from "./discoverTv";
import type {
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
  SpokenLanguage,
} from "./movie";
import type {
  SearchMovie,
  SearchMovieQuery,
  SearchMovieResponse,
} from "./searchMovie";

interface Buy {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}
interface WatchProviderResponse {
  id: number;
  results: {
    [x: string]: {
      buy: Buy[];
      flatrate: Buy[];
      link: string;
      rent: Buy[];
    };
  };
}

export type {
  Buy,
  WatchProviderResponse,
  Cast,
  Credits,
  DiscoverMovie,
  DiscoverMovieQuery,
  DiscoverMovieResult,
  DiscoverTv,
  DiscoverTvQuery,
  Genre,
  IMDB,
  Movie,
  MovieQuery,
  ProductionCompany,
  ProductionCountry,
  ReleaseDate,
  ReleaseDates,
  SearchMovie,
  SearchMovieQuery,
  SearchMovieResponse,
  SpokenLanguage,
};
