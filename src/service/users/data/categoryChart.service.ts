// eslint-disable-next-line import/no-unresolved
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";

const categoryChartService = async (uid: string, authToken: string | null) => {
  try {
    let firebaseUser: DecodedIdToken | null = null;

    if (authToken) {
      firebaseUser = await getAuth().verifyIdToken(authToken);
    }
    const dbUser = await client.db(tmrev.db).collection(tmrev.collection.users);
    const dbReviews = await client
      .db(tmrev.db)
      .collection(tmrev.collection.reviews);

    const user = await dbUser.findOne({ uuid: uid });

    if (!user) {
      return {
        success: false,
        error: "unable to find user",
      };
    }

    const searchQuery = () => {
      if (!firebaseUser || firebaseUser.uid !== uid) {
        return { userId: user.uuid, public: true };
      }

      return { userId: user.uuid };
    };

    const userReviews = await dbReviews.find(searchQuery()).toArray();

    const data = {
      personalScore: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
      },
      acting: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
      },
      characters: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
      },
      cinematography: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
      },
      climax: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
      },
      ending: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
      },
      music: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
      },

      plot: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
      },
      theme: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
      },
      visuals: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
      },
    };

    userReviews.forEach((review) => {
      if (!review.advancedScore) return;

      Object.keys(review.advancedScore).forEach((category) => {
        (data as any)[category][review.advancedScore[category]].push(
          review.tmdbID
        );
      });
    });

    return {
      success: true,
      body: {
        data,
      },
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default categoryChartService;
