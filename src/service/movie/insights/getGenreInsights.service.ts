/* eslint-disable @typescript-eslint/ban-ts-comment */
import { client } from "../../..";
import {
  watchedGenrePipeline,
  movieDetailsPipeline,
} from "../../../constants/pipelines";
import { tmrev } from "../../../models/mongodb";

const getGenreInsightsService = async (userId: string) => {
  try {
    const watchedDb = client.db(tmrev.db).collection(tmrev.collection.watched);
    const reviewDb = client.db(tmrev.db).collection(tmrev.collection.reviews);

    const watchedMovies = await watchedDb
      .aggregate([{ $match: { userId } }, ...watchedGenrePipeline])
      .toArray();

    const reviewedMovies = await reviewDb
      .aggregate([{ $match: { userId } }, ...movieDetailsPipeline])
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

    const rankedReviewedActingScoreGenres = new Map<string, number>();
    const rankedReviewedCharactersScoreGenres = new Map<string, number>();
    const rankedReviewedCinematographyScoreGenres = new Map<string, number>();
    const rankedReviewedClimaxScoreGenres = new Map<string, number>();
    const rankedReviewedEndingScoreGenres = new Map<string, number>();
    const rankedReviewedMusicScoreGenres = new Map<string, number>();
    const rankedReviewedPersonalScoreGenres = new Map<string, number>();
    const rankedReviewedPlotScoreGenres = new Map<string, number>();
    const rankedReviewedThemeScoreGenres = new Map<string, number>();
    const rankedReviewedVisualsScoreGenres = new Map<string, number>();

    reviewedGenreMap.forEach((value, key) => {
      const genreMovies = reviewedMovies.filter((movie) =>
        movie.movieDetails.genres.some(
          (genre: { id: number; name: string }) => genre.name === key
        )
      );

      const totalAveragedAdvancedScore = genreMovies.reduce(
        (acc, movie) => acc + movie.averagedAdvancedScore,
        0
      );
      const totalActingScore = genreMovies.reduce(
        (acc, movie) => acc + movie.advancedScore.acting,
        0
      );
      const totalCharactersScore = genreMovies.reduce(
        (acc, movie) => acc + movie.advancedScore.characters,
        0
      );
      const totalCinematographyScore = genreMovies.reduce(
        (acc, movie) => acc + movie.advancedScore.cinematography,
        0
      );
      const totalClimaxScore = genreMovies.reduce(
        (acc, movie) => acc + movie.advancedScore.climax,
        0
      );
      const totalEndingScore = genreMovies.reduce(
        (acc, movie) => acc + movie.advancedScore.ending,
        0
      );
      const totalMusicScore = genreMovies.reduce(
        (acc, movie) => acc + movie.advancedScore.music,
        0
      );
      const totalPersonalScore = genreMovies.reduce(
        (acc, movie) => acc + movie.advancedScore.personalScore,
        0
      );
      const totalPlotScore = genreMovies.reduce(
        (acc, movie) => acc + movie.advancedScore.plot,
        0
      );
      const totalThemeScore = genreMovies.reduce(
        (acc, movie) => acc + movie.advancedScore.theme,
        0
      );
      const totalVisualsScore = genreMovies.reduce(
        (acc, movie) => acc + movie.advancedScore.visuals,
        0
      );

      const averageAverageAdvancedScore =
        Math.round((totalAveragedAdvancedScore / genreMovies.length) * 10) / 10;
      rankedReviewedAveragedAdvancedScoreGenres.set(
        key,
        averageAverageAdvancedScore
      );

      const averageActingScore =
        Math.round((totalActingScore / genreMovies.length) * 10) / 10;
      rankedReviewedActingScoreGenres.set(key, averageActingScore);
      const averageCharactersScore =
        Math.round((totalCharactersScore / genreMovies.length) * 10) / 10;
      rankedReviewedCharactersScoreGenres.set(key, averageCharactersScore);
      const averageCinematographyScore =
        Math.round((totalCinematographyScore / genreMovies.length) * 10) / 10;
      rankedReviewedCinematographyScoreGenres.set(
        key,
        averageCinematographyScore
      );
      const averageClimaxScore =
        Math.round((totalClimaxScore / genreMovies.length) * 10) / 10;
      rankedReviewedClimaxScoreGenres.set(key, averageClimaxScore);
      const averageEndingScore =
        Math.round((totalEndingScore / genreMovies.length) * 10) / 10;
      rankedReviewedEndingScoreGenres.set(key, averageEndingScore);
      const averageMusicScore =
        Math.round((totalMusicScore / genreMovies.length) * 10) / 10;
      rankedReviewedMusicScoreGenres.set(key, averageMusicScore);
      const averagePersonalScore =
        Math.round((totalPersonalScore / genreMovies.length) * 10) / 10;
      rankedReviewedPersonalScoreGenres.set(key, averagePersonalScore);
      const averagePlotScore =
        Math.round((totalPlotScore / genreMovies.length) * 10) / 10;
      rankedReviewedPlotScoreGenres.set(key, averagePlotScore);
      const averageThemeScore =
        Math.round((totalThemeScore / genreMovies.length) * 10) / 10;
      rankedReviewedThemeScoreGenres.set(key, averageThemeScore);
      const averageVisualsScore =
        Math.round((totalVisualsScore / genreMovies.length) * 10) / 10;
      rankedReviewedVisualsScoreGenres.set(key, averageVisualsScore);
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
    const sortedRankedActingReviewedGenres = new Map(
      [...rankedReviewedActingScoreGenres.entries()].sort((a, b) => b[1] - a[1])
    );
    const sortedRankedCharactersReviewedGenres = new Map(
      [...rankedReviewedCharactersScoreGenres.entries()].sort(
        (a, b) => b[1] - a[1]
      )
    );
    const sortedRankedCinematographyReviewedGenres = new Map(
      [...rankedReviewedCinematographyScoreGenres.entries()].sort(
        (a, b) => b[1] - a[1]
      )
    );
    const sortedRankedClimaxReviewedGenres = new Map(
      [...rankedReviewedClimaxScoreGenres.entries()].sort((a, b) => b[1] - a[1])
    );
    const sortedRankedEndingReviewedGenres = new Map(
      [...rankedReviewedEndingScoreGenres.entries()].sort((a, b) => b[1] - a[1])
    );
    const sortedRankedMusicReviewedGenres = new Map(
      [...rankedReviewedMusicScoreGenres.entries()].sort((a, b) => b[1] - a[1])
    );
    const sortedRankedPersonalReviewedGenres = new Map(
      [...rankedReviewedPersonalScoreGenres.entries()].sort(
        (a, b) => b[1] - a[1]
      )
    );
    const sortedRankedPlotReviewedGenres = new Map(
      [...rankedReviewedPlotScoreGenres.entries()].sort((a, b) => b[1] - a[1])
    );
    const sortedRankedThemeReviewedGenres = new Map(
      [...rankedReviewedThemeScoreGenres.entries()].sort((a, b) => b[1] - a[1])
    );
    const sortedRankedVisualsReviewedGenres = new Map(
      [...rankedReviewedVisualsScoreGenres.entries()].sort(
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
    )
      .slice(0, 5)
      .map(([genre, count]) => ({ label: genre, value: count }));
    const actingRankedGenres = Array.from(
      sortedRankedActingReviewedGenres
    ).slice(0, 5);
    const charactersRankedGenres = Array.from(
      sortedRankedCharactersReviewedGenres
    ).slice(0, 5);
    const cinematographyRankedGenres = Array.from(
      sortedRankedCinematographyReviewedGenres
    ).slice(0, 5);
    const climaxRankedGenres = Array.from(
      sortedRankedClimaxReviewedGenres
    ).slice(0, 5);
    const endingRankedGenres = Array.from(
      sortedRankedEndingReviewedGenres
    ).slice(0, 5);
    const musicRankedGenres = Array.from(sortedRankedMusicReviewedGenres).slice(
      0,
      5
    );
    const personalRankedGenres = Array.from(
      sortedRankedPersonalReviewedGenres
    ).slice(0, 5);
    const plotRankedGenres = Array.from(sortedRankedPlotReviewedGenres).slice(
      0,
      5
    );
    const themeRankedGenres = Array.from(sortedRankedThemeReviewedGenres).slice(
      0,
      5
    );
    const visualsRankedGenres = Array.from(
      sortedRankedVisualsReviewedGenres
    ).slice(0, 5);

    const worstActingRankedGenres = Array.from(sortedRankedActingReviewedGenres)
      .slice(sortedRankedActingReviewedGenres.size - 5)
      .sort((a, b) => a[1] - b[1]);
    const worstCharactersRankedGenres = Array.from(
      sortedRankedCharactersReviewedGenres
    )
      .slice(sortedRankedCharactersReviewedGenres.size - 5)
      .sort((a, b) => a[1] - b[1]);
    const worstCinematographyRankedGenres = Array.from(
      sortedRankedCinematographyReviewedGenres
    )
      .slice(sortedRankedCinematographyReviewedGenres.size - 5)
      .sort((a, b) => a[1] - b[1]);
    const worstClimaxRankedGenres = Array.from(sortedRankedClimaxReviewedGenres)
      .slice(sortedRankedClimaxReviewedGenres.size - 5)
      .sort((a, b) => a[1] - b[1]);
    const worstEndingRankedGenres = Array.from(sortedRankedEndingReviewedGenres)
      .slice(sortedRankedEndingReviewedGenres.size - 5)
      .sort((a, b) => a[1] - b[1]);
    const worstMusicRankedGenres = Array.from(sortedRankedMusicReviewedGenres)
      .slice(sortedRankedMusicReviewedGenres.size - 5)
      .sort((a, b) => a[1] - b[1]);
    const worstPersonalRankedGenres = Array.from(
      sortedRankedPersonalReviewedGenres
    )
      .slice(sortedRankedPersonalReviewedGenres.size - 5)
      .sort((a, b) => a[1] - b[1]);
    const worstPlotRankedGenres = Array.from(sortedRankedPlotReviewedGenres)
      .slice(sortedRankedPlotReviewedGenres.size - 5)
      .sort((a, b) => a[1] - b[1]);
    const worstThemeRankedGenres = Array.from(sortedRankedThemeReviewedGenres)
      .slice(sortedRankedThemeReviewedGenres.size - 5)
      .sort((a, b) => a[1] - b[1]);
    const worstVisualsRankedGenres = Array.from(
      sortedRankedVisualsReviewedGenres
    )
      .slice(sortedRankedVisualsReviewedGenres.size - 5)
      .sort((a, b) => a[1] - b[1]);

    const leastReviewedRankedGenres = Array.from(
      sortedRankedAveragedAdvancedReviewedGenres
    )
      .slice(sortedRankedAveragedAdvancedReviewedGenres.size - 5)
      .sort((a, b) => a[1] - b[1])
      .map(([genre, count]) => ({ label: genre, value: count }));

    const bestAdvancedScoreRankedGenres = {
      acting: actingRankedGenres.map(([genre, count]) => ({
        label: genre,
        value: count,
      })),
      characters: charactersRankedGenres.map(([genre, count]) => ({
        label: genre,
        value: count,
      })),
      cinematography: cinematographyRankedGenres.map(([genre, count]) => ({
        label: genre,
        value: count,
      })),
      climax: climaxRankedGenres.map(([genre, count]) => ({
        label: genre,
        value: count,
      })),
      ending: endingRankedGenres.map(([genre, count]) => ({
        label: genre,
        value: count,
      })),
      music: musicRankedGenres.map(([genre, count]) => ({
        label: genre,
        value: count,
      })),
      personalScore: personalRankedGenres.map(([genre, count]) => ({
        label: genre,
        value: count,
      })),
      plot: plotRankedGenres.map(([genre, count]) => ({
        label: genre,
        value: count,
      })),
      theme: themeRankedGenres.map(([genre, count]) => ({
        label: genre,
        value: count,
      })),
      visuals: visualsRankedGenres.map(([genre, count]) => ({
        label: genre,
        value: count,
      })),
    };

    const worstAdvancedScoreRankedGenres = {
      acting: worstActingRankedGenres.map(([genre, count]) => ({
        label: genre,
        value: count,
      })),
      characters: worstCharactersRankedGenres.map(([genre, count]) => ({
        label: genre,
        value: count,
      })),
      cinematography: worstCinematographyRankedGenres.map(([genre, count]) => ({
        label: genre,
        value: count,
      })),
      climax: worstClimaxRankedGenres.map(([genre, count]) => ({
        label: genre,
        value: count,
      })),
      ending: worstEndingRankedGenres.map(([genre, count]) => ({
        label: genre,
        value: count,
      })),
      music: worstMusicRankedGenres.map(([genre, count]) => ({
        label: genre,
        value: count,
      })),
      personalScore: worstPersonalRankedGenres.map(([genre, count]) => ({
        label: genre,
        value: count,
      })),
      plot: worstPlotRankedGenres.map(([genre, count]) => ({
        label: genre,
        value: count,
      })),
      theme: worstThemeRankedGenres.map(([genre, count]) => ({
        label: genre,
        value: count,
      })),
      visuals: worstVisualsRankedGenres.map(([genre, count]) => ({
        label: genre,
        value: count,
      })),
    };

    // find the top 3 most occurring genres in the bestAdvancedScoreRankedGenres using the first string in the array element

    const bestGenreCount = new Map<string, number>();
    Object.keys(bestAdvancedScoreRankedGenres).forEach((key: any) => {
      // @ts-ignore
      (bestAdvancedScoreRankedGenres[key as unknown as any] as any[]).forEach(
        (genre: { label: string; value: number }) => {
          if (bestGenreCount.has(genre.label)) {
            const count = bestGenreCount.get(genre.label);
            if (count !== undefined) {
              bestGenreCount.set(genre.label, count + 1);
            }
          } else {
            bestGenreCount.set(genre.label, 1);
          }
        }
      );
    });

    const worstGenreCount = new Map<string, number>();
    Object.keys(worstAdvancedScoreRankedGenres).forEach((key: any) => {
      // @ts-ignore
      (worstAdvancedScoreRankedGenres[key as unknown as any] as any[]).forEach(
        (genre: { label: string; value: number }) => {
          if (worstGenreCount.has(genre.label)) {
            const count = worstGenreCount.get(genre.label);
            if (count !== undefined) {
              worstGenreCount.set(genre.label, count + 1);
            }
          } else {
            worstGenreCount.set(genre.label, 1);
          }
        }
      );
    });

    const bestGenres = Array.from(bestGenreCount.entries()).sort(
      (a, b) => b[1] - a[1]
    );
    const topGenres = bestGenres.slice(0, 3).map((genre) => genre[0]);

    const worstGenres = Array.from(worstGenreCount.entries()).sort(
      (a, b) => b[1] - a[1]
    );
    const worstGenresTop = worstGenres.slice(0, 3).map((genre) => genre[0]);

    return {
      success: true,
      data: {
        favoriteGenres: topGenres,
        leastFavoriteGenres: worstGenresTop,
        mostWatchedGenres,
        mostReviewedGenres,
        mostReviewedRankedGenres,
        leastReviewedRankedGenres,
        bestAdvancedScoreRankedGenres,
        worstAdvancedScoreRankedGenres,
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
