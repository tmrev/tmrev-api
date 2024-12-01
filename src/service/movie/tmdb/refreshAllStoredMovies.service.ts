/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { Filter, WithId, ObjectId, Document } from "mongodb";
import { client } from "../../..";
import updateMovies from "../../../functions/updateMovies";
import { tmrev } from "../../../models/mongodb";

async function getMovies(lastId: ObjectId | null, limit: number) {
  const query: Filter<WithId<Document>> = lastId
    ? { _id: { $gt: new ObjectId(lastId), watchProviders: null } }
    : {};
  const result = await client
    .db(tmrev.db)
    .collection(tmrev.collection.movies)
    .find(query)
    .limit(limit)
    .toArray(); // Adjust the collection name and query as necessary

  console.log("result", result.length);

  return result;
}

function wait(ms: number) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function refreshAllStoredMovies(batchSize = 100, waitTime = 1000) {
  let lastId = null;
  let movies;

  do {
    movies = await getMovies(lastId, batchSize);
    if (movies.length > 0) {
      for (const movie of movies) {
        await updateMovies(movie.id);
        await wait(waitTime); // Wait between each request to avoid rate limiting
      }
      lastId = movies[movies.length - 1]._id; // Assuming _id is the unique identifier
    }
  } while (movies.length === batchSize);
}

export default refreshAllStoredMovies;
