import axios, { AxiosResponse } from "axios";
import { TMDB_API_KEY, TMDB_BASE_URL } from "../../constants";
import { Movie } from "../../models/tmdb";

const getDetails = async (movieId: number, append = true) => {
  try {
    const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`;
    const additional = `&append_to_response=credits,release_dates
`;
    const res: AxiosResponse<Movie> = await axios(
      `${url}${append ? additional : ""}`
    );

    const data = await res.data;

    return data;
  } catch (error) {
    return null;
  }
};

export default getDetails;
