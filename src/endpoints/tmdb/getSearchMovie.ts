import axios, { AxiosResponse } from "axios";
import { TMDB_API_KEY, TMDB_BASE_URL } from "../../constants";
import { SearchMovieQuery, SearchMovieResponse } from "../../models/tmdb";
import { generateUrl } from "../../utils/common";

const getSearchMovie = async (query: SearchMovieQuery) => {
  try {
    const res: AxiosResponse<SearchMovieResponse> = await axios(
      `${generateUrl(
        `${TMDB_BASE_URL}search/movie`,
        query
      )}&api_key=${TMDB_API_KEY}`
    );

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getSearchMovie;
