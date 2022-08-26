// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

export const TMDB_BASE_URL = "https://api.themoviedb.org/3/";
export const TMDB_API_KEY = process.env.TMDB_API_KEY as string;
