import { CreateMoviePayload, MongoMoviePayload } from '../../models/movieReviews';
import { client } from '../..';
import { tmrev } from '../../models/mongodb';
import { getAuth } from 'firebase-admin/auth';
import { timestamp } from '../../utils/common';


export const createReviewService = async (
  data: CreateMoviePayload,
  authToken: string
) => {
  try {

    const dbReviews = client.db(tmrev.db).collection(tmrev.collection.reviews);
    const dbUsers = client.db(tmrev.db).collection(tmrev.collection.users)

    const firebaseUser = await getAuth().verifyIdToken(authToken);
    console.log(firebaseUser.uid)
    const dbUser = await dbUsers.findOne({uuid: firebaseUser.uid})

    const getAvg = () => {
      const allValues = Object.values(data.advancedScore);
      const sum = allValues.reduce((prev, curr) => (
        prev + curr
      ), 0);
  
      return sum / allValues.length;
    }

    const payload: MongoMoviePayload = {
      createdAt: timestamp(),
      updatedAt: timestamp(),
      userId: firebaseUser.uid,
      averagedAdvancedScore: getAvg(),
      user: dbUser?._id,
      notes: data.notes,
      tmdbID: data.tmdbID,
      reviewedDate: data.reviewedDate,
      advancedScore: data.advancedScore,
      public: data.public,
      release_date: data.release_date,
      title: data.title
    }

    const result = await dbReviews.insertOne(payload);

    return result;
  } catch (err: any) {
    console.log(err.errInfo.details.schemaRulesNotSatisfied)
    throw err;
  }
};
