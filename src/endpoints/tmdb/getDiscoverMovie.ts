import axios, { AxiosResponse } from "axios";
import { TMDB_API_KEY, TMDB_BASE_URL } from "../../constants";
import { DiscoverMovie } from "../../models/tmdb";

const getDiscoverMovie = async (page = 1) => {
  try {
    const res: AxiosResponse<DiscoverMovie> = await axios(
      `${TMDB_BASE_URL}/movie/?api_key=${TMDB_API_KEY}&page=${page}`
    );

    const data = await res.data;

    return data;
  } catch (error) {
    return null;
  }
};

export default getDiscoverMovie;
