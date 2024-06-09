/* eslint-disable @typescript-eslint/ban-ts-comment */
import { client } from "../../..";
import {
  watchedGenrePipeline,
  movieReviewScorePipeline,
} from "../../../constants/pipelines";
import { tmrev } from "../../../models/mongodb";

const getGenreInsightsService = async (userId: string) => {
  try {
    const watchedDb = client.db(tmrev.db).collection(tmrev.collection.watched);
    const reviewDb = client.db(tmrev.db).collection(tmrev.collection.reviews);

    const getGenreInsightsValues = await client
      .db(tmrev.db)
      .collection(tmrev.collection.insights)
      .findOne({ type: "getGenreInsights" });

    const watchedMovies = await watchedDb
      .aggregate([{ $match: { userId } }, ...watchedGenrePipeline])
      .toArray();

    const reviewedMovies = await reviewDb
      .aggregate([{ $match: { userId } }, ...movieReviewScorePipeline])
      .toArray();

    // parse the movieDetails.genres array and count the number of times each genre appears
    const watchedGenreMap = new Map<string, number>();
    watchedMovies.forEach((movie) => {
      movie.movieDetails.genres.forEach(
        (genre: { id: number; name: string }) => {
          if (watchedGenreMap.has(genre.name)) {
            const count = watchedGenreMap.get(genre.name);
            if (count !== undefined) {
              watchedGenreMap.set(genre.name, count + 1);
            }
          } else {
            watchedGenreMap.set(genre.name, 1);
          }
        }
      );
    });

    const reviewedGenreMap = new Map<string, number>();
    reviewedMovies.forEach((movie) => {
      movie.movieDetails.genres.forEach(
        (genre: { id: number; name: string }) => {
          if (reviewedGenreMap.has(genre.name)) {
            const count = reviewedGenreMap.get(genre.name);
            if (count !== undefined) {
              reviewedGenreMap.set(genre.name, count + 1);
            }
          } else {
            reviewedGenreMap.set(genre.name, 1);
          }
        }
      );
    });

    // get the average averagedAdvancedScore for each genre then sort by the highest average
    const rankedReviewedAveragedAdvancedScoreGenres = new Map<string, number>();

    const normalizedScores = new Map<string, number>();
    // 1. find the review scores for each genre
    // 2. find the 2 highest and lowest advanced score for each genre
    // 1. create a normalized score based on the 2 highest and lowest advanced score

    const genreList: { [x: string]: number[] } = {};

    reviewedMovies.forEach((movie) => {
      movie.movieDetails.genres.forEach((genre: any) => {
        if (genreList[genre.name] === undefined) {
          genreList[genre.name] = [movie.averagedAdvancedScore];
        } else {
          genreList[genre.name].push(movie.averagedAdvancedScore);
        }
      });
    });

    // filter out the genres that have less than 4 reviews
    Object.keys(genreList).forEach((key) => {
      if (genreList[key].length < 4) {
        delete genreList[key];
      }
    });

    // find the 2 highest and lowest advanced score for each genre
    Object.keys(genreList).forEach((key) => {
      const sortedScores = genreList[key].sort((a, b) => a - b);
      const highest = sortedScores[sortedScores.length - 1];
      const secondHighest = sortedScores[sortedScores.length - 2];
      const lowest = sortedScores[0];
      const secondLowest = sortedScores[1];

      // Calculate the normalized score based on the 2 highest and lowest advanced score
      const normalizedScore =
        (highest - secondLowest) / (highest - lowest) +
        (secondHighest - lowest) / (highest - lowest);

      normalizedScores.set(key, normalizedScore);
    });

    normalizedScores.forEach((value, key) => {
      // Calculate the normalized review count
      const normalizedReviewCount =
        genreList[key].length / reviewedMovies.length;

      // Calculate the normalized average score
      const normalizedAverageScore = value;

      // Define the coefficients for each factor
      const reviewCountCoefficient =
        getGenreInsightsValues?.reviewCountCoefficient || 0.5;
      const averageScoreCoefficient =
        getGenreInsightsValues?.averageScoreCoefficient || 0.75;

      // Calculate the affinity score using the coefficients
      const affinityScore =
        reviewCountCoefficient * normalizedReviewCount +
        averageScoreCoefficient * normalizedAverageScore;

      rankedReviewedAveragedAdvancedScoreGenres.set(key, affinityScore);
    });

    // sort the genres by the number of times they appear
    const sortedWatchedGenres = new Map(
      [...watchedGenreMap.entries()].sort((a, b) => b[1] - a[1])
    );
    const sortedReviewedGenres = new Map(
      [...reviewedGenreMap.entries()].sort((a, b) => b[1] - a[1])
    );
    const sortedRankedAveragedAdvancedReviewedGenres = new Map(
      [...rankedReviewedAveragedAdvancedScoreGenres.entries()].sort(
        (a, b) => b[1] - a[1]
      )
    );

    // return the top 5 genres sorted by the number of times they appear with count
    const mostWatchedGenres = Array.from(sortedWatchedGenres)
      .slice(0, 5)
      .map(([genre, count]) => ({ label: genre, value: count }));
    const mostReviewedGenres = Array.from(sortedReviewedGenres)
      .slice(0, 5)
      .map(([genre, count]) => ({ label: genre, value: count }));
    const mostReviewedRankedGenres = Array.from(
      sortedRankedAveragedAdvancedReviewedGenres
    ).map(([genre, count]) => ({ label: genre, value: count }));
    const leastReviewedRankedGenres = Array.from(
      sortedRankedAveragedAdvancedReviewedGenres
    )
      .slice(sortedRankedAveragedAdvancedReviewedGenres.size - 5)
      .sort((a, b) => a[1] - b[1])
      .map(([genre, count]) => ({ label: genre, value: count }));

    return {
      success: true,
      data: {
        mostWatchedGenres,
        mostReviewedGenres,
        mostReviewedRankedGenres,
        leastReviewedRankedGenres,
      },
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default getGenreInsightsService;
