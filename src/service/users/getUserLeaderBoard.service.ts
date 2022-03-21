import { client } from '../..';
import lastWeekDate from '../../utils/lastWeekDate';

export const getUserLeaderBoardService = async () => {
    try {
        const db = client.db('Reviews').collection('MovieReviews');

        console.log(lastWeekDate())

        const top3pipelineWeekly = [
            {
                '$match': {
                    'createdAt.seconds': {
                        '$gt': lastWeekDate()
                    }
                }
            }, {
                '$group': {
                    '_id': '$userId',
                    'reviews': {
                        '$sum': 1
                    }
                }
            }, {
                '$lookup': {
                    'from': 'Users',
                    'localField': '_id',
                    'foreignField': 'uuid',
                    'as': 'user'
                }
            }, {
                '$unwind': {
                    'path': '$user'
                }
            }, {
                '$project': {
                    '_id': '$_id',
                    'reviews': '$reviews',
                    'email': '$user.email',
                    'uuid': '$user.uuid'
                }
            }, {
                '$sort': {
                    'reviews': -1
                }
            }, {
                '$limit': 3
            }
        ]

        const top3pipelineAllTime = [
            {
                '$group': {
                    '_id': '$userId',
                    'reviews': {
                        '$sum': 1
                    }
                }
            }, {
                '$lookup': {
                    'from': 'Users',
                    'localField': '_id',
                    'foreignField': 'uuid',
                    'as': 'user'
                }
            }, {
                '$unwind': {
                    'path': '$user'
                }
            }, {
                '$project': {
                    '_id': '$_id',
                    'reviews': '$reviews',
                    'email': '$user.email',
                    'uuid': '$user.uuid'
                }
            }, {
                '$sort': {
                    'reviews': -1
                }
            }, {
                '$limit': 3
            }
        ]

        const top3ResultAllTime = await db.aggregate(top3pipelineAllTime).toArray()

        const top3ResultsWeekly = await db.aggregate(top3pipelineWeekly).toArray()



        return {
            weekly: top3ResultsWeekly,
            allTime: top3ResultAllTime
        }


    } catch (error) {
        throw error
    }
}