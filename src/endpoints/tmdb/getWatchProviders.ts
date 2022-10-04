import axios, { AxiosResponse } from "axios";
import { TMDB_API_KEY, TMDB_BASE_URL } from "../../constants";
import { WatchProviderResponse } from "../../models/tmdb";

const getWatchProviders = async (movieId: number) => {
  try {
    const url = `${TMDB_BASE_URL}/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`;

    const res: AxiosResponse<WatchProviderResponse> = await axios(url);

    const data = await res.data;

    return data;
  } catch (error) {
    return null;
  }
};

export default getWatchProviders;
