import axios, { AxiosResponse } from "axios";
import { TMDB_API_KEY, TMDB_BASE_URL } from "../../constants";
import { DiscoverMovie } from "../../models/tmdb";

const getDetails = async (movieId: number) => {
  try {
    const res: AxiosResponse<DiscoverMovie> = await axios(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,release_dates,reviews`
    );

    const data = await res.data;

    return data;
  } catch (error: any) {
    console.error(error);
    return null;
  }
};

export default getDetails;
