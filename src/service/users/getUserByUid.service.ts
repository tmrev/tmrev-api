import { getAuth } from 'firebase-admin/auth';
import { client } from '../..';
import { tmrev } from '../../models/mongodb';

export const getUserByUidService = async (uid: string) => {
  try {
    const user = await getAuth().getUser(uid);

    const db = client.db(tmrev.db).collection(tmrev.collection.users);

    const result = await db.findOne({ uuid: uid })

    console.log(result)

    return {
      ...result,
      displayName: user.displayName,
      photoUrl: user.photoURL,
      email: user.email
    };
  } catch (error) {
    throw error;
  }
};
