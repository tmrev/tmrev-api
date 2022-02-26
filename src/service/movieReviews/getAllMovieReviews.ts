import { client } from '../..';

export const getAllMovieReviewsService = async (tmdbID: string) => {
  try {
    const db = client.db('Reviews').collection('MovieReviews');

    const result = await db.find({tmdbID: Number(tmdbID), public: true}).toArray();

    return result;
  } catch (err) {
    throw err;
  }
};
