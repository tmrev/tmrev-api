import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import { movieActorPipeline } from "../../../constants/pipelines";

type Actor = {
  count: number;
  details: {
    adult: boolean;
    gender: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
  };
  id: number;
  name: string;
};

type Cast = {
  adult: boolean;
  cast_id: number;
  character: string;
  credit_id: string;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  order: number;
  original_name: string;
  popularity: number;
  profile_path: string;
};

const getActorInsightsService = async (userId: string) => {
  try {
    const reviewDb = client.db(tmrev.db).collection(tmrev.collection.reviews);
    const watchedDb = client.db(tmrev.db).collection(tmrev.collection.watched);

    const watchedMovies = await watchedDb
      .aggregate([{ $match: { userId } }, ...movieActorPipeline])
      .toArray();

    const reviewedMovies = await reviewDb
      .aggregate([{ $match: { userId } }, ...movieActorPipeline])
      .toArray();

    const watchedActorMap = new Map<number, Actor>();
    watchedMovies.forEach((movie) => {
      movie.movieDetails.credits.cast.forEach((cast: Cast) => {
        if (watchedActorMap.has(cast.id)) {
          const actor = watchedActorMap.get(cast.id);
          if (actor?.count !== undefined) {
            watchedActorMap.set(cast.id, {
              id: cast.id,
              name: cast.name,
              count: actor.count + 1,
              details: {
                adult: cast.adult,
                gender: cast.gender,
                known_for_department: cast.known_for_department,
                name: cast.name,
                original_name: cast.original_name,
                popularity: cast.popularity,
                profile_path: cast.profile_path,
              },
            });
          }
        } else {
          watchedActorMap.set(cast.id, {
            id: cast.id,
            name: cast.name,
            count: 1,
            details: {
              adult: cast.adult,
              gender: cast.gender,
              known_for_department: cast.known_for_department,
              name: cast.name,
              original_name: cast.original_name,
              popularity: cast.popularity,
              profile_path: cast.profile_path,
            },
          });
        }
      });
    });

    const reviewedActorMap = new Map<number, Actor>();
    reviewedMovies.forEach((movie) => {
      movie.movieDetails.credits.cast.forEach((cast: Cast) => {
        if (reviewedActorMap.has(cast.id)) {
          const actor = reviewedActorMap.get(cast.id);
          if (actor?.count !== undefined) {
            reviewedActorMap.set(cast.id, {
              id: cast.id,
              name: cast.name,
              count: actor.count + 1,
              details: {
                adult: cast.adult,
                gender: cast.gender,
                known_for_department: cast.known_for_department,
                name: cast.name,
                original_name: cast.original_name,
                popularity: cast.popularity,
                profile_path: cast.profile_path,
              },
            });
          }
        } else {
          reviewedActorMap.set(cast.id, {
            id: cast.id,
            name: cast.name,
            count: 1,
            details: {
              adult: cast.adult,
              gender: cast.gender,
              known_for_department: cast.known_for_department,
              name: cast.name,
              original_name: cast.original_name,
              popularity: cast.popularity,
              profile_path: cast.profile_path,
            },
          });
        }
      });
    });

    const watchedActorMapSorted = [...watchedActorMap.entries()]
      .map((value) => value[1])
      .sort((a, b) => b.count - a.count)
      .splice(0, 10);

    const reviewedActorMapSorted = [...reviewedActorMap.entries()]
      .map((value) => value[1])
      .sort((a, b) => b.count - a.count)
      .splice(0, 10);

    return {
      success: true,
      watchedActorMapSorted,
      reviewedActorMapSorted,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default getActorInsightsService;
