import { getAuth } from 'firebase-admin/auth';
import { ObjectId } from 'mongodb';
import { client } from '../..';

export const deleteReviewService = async (authToken: string, uuid: string) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db('Reviews').collection('MovieReviews');

    const id = new ObjectId(uuid);

    const movie = await db.findOne({ _id: id })
    
    if (movie) {
      if (movie.userId === user.uid) {
        const result = await db.deleteOne({ _id: id });
        
        return result
      } else {
        throw new Error('Not authorized to delete this review')
      }
    }

    throw new Error('Review not found')


  } catch (err) {
    throw err;
  }
};
