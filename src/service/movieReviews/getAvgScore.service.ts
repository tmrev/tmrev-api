import { client } from '../..';

export const getAvgScoreService = async (tmdbID: number) => {
  try {


    const db = client.db('Reviews').collection('MovieReviews');

    const result = await db.aggregate([
      {
        '$match': {
          'tmdbID': tmdbID,
          'public': true
        }
      }, {
        '$group': {
          '_id': {
            'tmdbID': '$tmdbID',
            'title': '$title'
          },
          'totalScore': {
            '$avg': {
              '$round': '$averagedAdvancedScore'
            }
          },
          'plot': {
            '$avg': {
              '$round': '$advancedScore.plot'
            }
          },
          'theme': {
            '$avg': {
              '$round': '$advancedScore.theme'
            }
          },
          'climax': {
            '$avg': {
              '$round': '$advancedScore.climax'
            }
          },
          'ending': {
            '$avg': {
              '$round': '$advancedScore.ending'
            }
          },
          'acting': {
            '$avg': {
              '$round': '$advancedScore.acting'
            }
          },
          'characters': {
            '$avg': {
              '$round': '$advancedScore.characters'
            }
          },
          'music': {
            '$avg': {
              '$round': '$advancedScore.music'
            }
          },
          'cinematography': {
            '$avg': {
              '$round': '$advancedScore.cinematography'
            }
          },
          'visuals': {
            '$avg': {
              '$round': '$advancedScore.visuals'
            }
          },
          'personalScore': {
            '$avg': {
              '$round': '$advancedScore.personalScore'
            }
          }
        }
      }
    ]).toArray()

    return result;
  } catch (err) {
    throw err;
  }
};
