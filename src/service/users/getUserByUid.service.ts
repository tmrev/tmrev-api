import { getAuth } from 'firebase-admin/auth';

export const getUserByUidService = async (uid: string) => {
  try {
    const user = await getAuth().getUser(uid);

    return {
      displayName: user.displayName,
      photoUrl: user.photoURL,
      email: user.email
    };
  } catch (error) {
    throw error;
  }
};
