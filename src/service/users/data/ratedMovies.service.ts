// eslint-disable-next-line import/no-unresolved
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";

const ratedUserMoviesService = async (
  uid: string,
  authToken: string | null
) => {
  try {
    let firebaseUser: DecodedIdToken | null = null;

    if (authToken) {
      firebaseUser = await getAuth().verifyIdToken(authToken);
    }
    const dbUser = await client.db(tmrev.db).collection(tmrev.collection.users);
    const dbReviews = await client
      .db(tmrev.db)
      .collection(tmrev.collection.reviews);

    const user = await dbUser.findOne({ uuid: firebaseUser?.uid || uid });

    if (!user) {
      return {
        success: false,
        error: "unable to find user",
      };
    }

    const highestReviews = await dbReviews
      .find({ userId: user.uuid, averagedAdvancedScore: { $ne: null } })
      .sort({ averagedAdvancedScore: -1 })
      .limit(10)
      .toArray();

    const lowestReviews = await dbReviews
      .find({ userId: user.uuid, averagedAdvancedScore: { $ne: null } })
      .sort({ averagedAdvancedScore: 1 })
      .limit(10)
      .toArray();

    return {
      success: true,
      body: {
        highest: highestReviews,
        lowest: lowestReviews,
      },
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default ratedUserMoviesService;
