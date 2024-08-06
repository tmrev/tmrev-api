import updateMovies from "../../../functions/updateMovies";

const updateStoredMovies = async (movies: string[]) => {
  try {
    const updateMoviesPromise = movies.map((id) => updateMovies(id));

    await Promise.all(updateMoviesPromise);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default updateStoredMovies;
