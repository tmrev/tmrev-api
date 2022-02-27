
import { client } from '../..';

export const searchWatchListService = async (
    q: string
) => {
    try {
        const db = client.db('WatchLists').collection('collection');

        const result = await db.aggregate([
            {
                $search: {
                    text: {
                        query: q,
                        path: ['tags', 'title'],
                        fuzzy: { maxEdits: 2 }
                    }
                },

            },
            {
                $match: {
                    public: true
                }
            },
            {
                $project: {
                    tags: 1,
                    title: 1,
                    description: 1,
                    movies: 1,
                    score: {$meta: "searchScore"}
                }
            },
            {
                $sort: {
                    score: -1
                }
            }
        ]).toArray()


        return result


    } catch (err) {
        throw err;
    }
};