import { client } from '../..';
import { tmrev } from '../../models/mongodb';

export const getAvgScoreService = async (tmdbID: number) => {
  try {


    const db = client.db(tmrev.db).collection(tmrev.collection.reviews);

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
            '$avg':'$averagedAdvancedScore'
          },
          'plot': {
            '$avg':'$advancedScore.plot'
          },
          'theme': {
            '$avg':'$advancedScore.theme'
          },
          'climax': {
            '$avg':'$advancedScore.climax'
          },
          'ending': {
            '$avg':'$advancedScore.ending'
          },
          'acting': {
            '$avg': '$advancedScore.acting'
          },
          'characters': {
            '$avg': '$advancedScore.characters'
          },
          'music': {
            '$avg': '$advancedScore.music'
          },
          'cinematography': {
            '$avg': '$advancedScore.cinematography'
          },
          'visuals': {
            '$avg': '$advancedScore.visuals'
          },
          'personalScore': {
            '$avg': '$advancedScore.personalScore'
            
          }
        }
      }
    ]).toArray()

    return result;
  } catch (err) {
    throw err;
  }
};
