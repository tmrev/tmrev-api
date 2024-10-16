import dayjs from "dayjs";
import { client } from "../../..";
import { movieReviewScorePipeline } from "../../../constants/pipelines";
import { tmrev } from "../../../models/mongodb";

const getHeatmapInsightsService = async (userId: string, days: number) => {
  try {
    const reviewDb = client.db(tmrev.db).collection(tmrev.collection.reviews);
    const heatmapData: number[] = [];

    const reviewedMovies = await reviewDb
      .aggregate([{ $match: { userId } }, ...movieReviewScorePipeline])
      .toArray();

    const targetDate = dayjs().subtract(days, "day");

    // return all movies within targetDate
    const filteredMovies = reviewedMovies.filter((movie) => {
      return dayjs(movie.reviewedDate).isAfter(targetDate);
    });

    // count the number of reviews for each day
    for (let i = days - 1; i >= 0; i -= 1) {
      const currentDate = dayjs().subtract(i, "day");
      const count = filteredMovies.filter((movie) => {
        return dayjs(movie.reviewedDate).isSame(currentDate, "day");
      }).length;
      heatmapData.push(count);
    }

    return {
      success: true,
      data: heatmapData,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default getHeatmapInsightsService;
