import { getAuth } from 'firebase-admin/auth';
import { client } from '../..';
import { tmrev } from '../../models/mongodb';

export const getUserService = async (uuid: string) => {
    try {
        const user = await getAuth().getUser(uuid);
        const db = client.db(tmrev.db).collection(tmrev.collection.users);

        const pipeline = [
            {
                '$match': {
                    'uuid': uuid
                }
            }, {
                '$lookup': {
                    'from': 'MovieReviews',
                    'localField': 'uuid',
                    'foreignField': 'userId',
                    'as': 'reviews'
                }
            }, {
                '$lookup': {
                    'from': 'WatchLists',
                    'localField': 'uuid',
                    'foreignField': 'userId',
                    'as': 'watchLists'
                }
            }
        ]

        const result = await db.aggregate(pipeline).toArray()

        return {
            displayName: user.displayName,
            photoUrl: user.photoURL,
            email: user.email,
            ...result[0]
        };
    } catch (error) {
        throw error;
    }
};
