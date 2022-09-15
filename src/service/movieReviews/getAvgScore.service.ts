import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const getAvgScoreService = async (tmdbID: number) => {
  try {
    const db = client.db(tmrev.db).collection(tmrev.collection.reviews);

    const result = await db
      .aggregate([
        {
          $match: {
            tmdbID,
            public: true,
          },
        },
        {
          $group: {
            _id: {
              tmdbID: "$tmdbID",
              title: "$title",
            },
            totalScore: {
              $avg: "$averagedAdvancedScore",
            },
            plot: {
              $avg: "$advancedScore.plot",
            },
            theme: {
              $avg: "$advancedScore.theme",
            },
            climax: {
              $avg: "$advancedScore.climax",
            },
            ending: {
              $avg: "$advancedScore.ending",
            },
            acting: {
              $avg: "$advancedScore.acting",
            },
            characters: {
              $avg: "$advancedScore.characters",
            },
            music: {
              $avg: "$advancedScore.music",
            },
            cinematography: {
              $avg: "$advancedScore.cinematography",
            },
            visuals: {
              $avg: "$advancedScore.visuals",
            },
            personalScore: {
              $avg: "$advancedScore.personalScore",
            },
          },
        },
      ])
      .toArray();

    return {
      success: true,
      body: result[0],
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default getAvgScoreService;
