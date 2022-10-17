import axios, { AxiosResponse } from "axios";
import { TMDB_API_KEY, TMDB_BASE_URL } from "../../constants";
import { Movie } from "../../models/tmdb";

interface Find {
  movie_results: Movie[];
  person_results: any[];
  tv_episode_results: any[];
  tv_results: any[];
  tv_season_results: any[];
}

const getFindExternal = async (externalId: string) => {
  try {
    const url = `${TMDB_BASE_URL}/find/${externalId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
    const res: AxiosResponse<Find> = await axios(`${url}`);

    const data = await res.data;

    return data;
  } catch (error) {
    return null;
  }
};

export default getFindExternal;
