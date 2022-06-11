import { getAuth } from "firebase-admin/auth";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

export const followerFeedService = async (limit: number, authToken: string) => {

    try {
        const user = await getAuth().verifyIdToken(authToken);
        const db = client.db(tmrev.db).collection(tmrev.collection.users);

        const pipeline = [
            {
                '$match': {
                    'uuid': user.uid
                }
            }, {
                '$lookup': {
                    'from': 'MovieReviews',
                    'as': 'followingReviews',
                    'let': {
                        'indicator_id': '$following'
                    },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$in': [
                                        '$userId', '$$indicator_id'
                                    ]
                                }
                            }
                        }, {
                            '$sort': {
                                'createdAt.seconds': -1
                            }
                        }, {
                            '$limit': limit
                        }
                    ]
                }
            }
        ]

        const results = await db.aggregate(pipeline).toArray()
        

        return results[0]
    } catch (error) {
        throw error
    }
}