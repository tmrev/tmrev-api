import { client } from "../..";

type Category = 'acting' | 'characters' | 'cinematography' | 'climax' | 'ending' | 'music' | 'personalScore' | 'plot' | 'theme' | 'visuals'

export const GetUserCategoryMoviesService = async (limit: number, sort: '-1' | '1', category: Category, uuid: string) => {

    try {
        const db = client.db('Reviews').collection('Users');
        const cat = `movies.advancedScore.${category}`

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
                    'as': 'movies'
                }
            }, {
                '$unwind': {
                    'path': '$movies'
                }
            }, {
                '$match': {
                    'movies.public': true
                }
            }, {
                '$sort': {
                    [cat]: Number(sort)
                }
            }, {
                '$limit': limit
            }, {
                '$project': {
                    'title': '$movies.title',
                    'score': `$${cat}`,
                    'tmdbID': '$movies.tmdbID',
                    'reviewedDate': '$movies.reviewedDate',
                    'createdAt': '$movies.createdAt',
                    'notes': '$movies.notes'
                }
            }
        ]

        const results = await db.aggregate(pipeline).toArray()

        return results
    } catch (error) {
        throw error
    }


}