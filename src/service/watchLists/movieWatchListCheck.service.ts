import { getAuth } from 'firebase-admin/auth';
import { ObjectId } from 'mongodb';
import { client } from '../..';

interface List {
  _id: ObjectId;
  title: string;
  description: string;
  public: boolean;
  movies: Movie[];
}

type Movie = {
  title: string;
  description: string;
  imdbId: string;
  poster: string;
  year: number;
  rottenId: string;
};

export const MovieWatchListCheckService = async (
  authToken: string,
  imdbId: string
) => {
  try {
    const listWithMovie: any[] = [];

    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db('WatchLists').collection(user.uid);

    const lists = (await db.find({}).toArray()) as unknown as List[];

    lists.forEach((list) => {
      list.movies.forEach((movie) => {
        if (movie.imdbId === imdbId) {
          listWithMovie.push({
            listTitle: list.title,
            listId: list._id,
            title: movie.title,
            imdbId: movie.imdbId,
            rottenId: movie.rottenId,
            year: movie.year,
          });
        }
      });
    });

    return listWithMovie;
  } catch (error) {
    throw error;
  }
};
