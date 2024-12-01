import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";

const getUserV2Service = async (userId: string, authToken?: string) => {
  try {
    let firebaseUser: DecodedIdToken | null;
    let isNotCurrentAuthUser = false;
    let authUser: any;
    let isFollowing = false;

    const userDB = client.db(tmrev.db).collection(tmrev.collection.users);
    const reviewDB = client.db(tmrev.db).collection(tmrev.collection.reviews);
    const listDB = client.db(tmrev.db).collection(tmrev.collection.watchlists);
    const watchedDB = client.db(tmrev.db).collection(tmrev.collection.watched);

    if (authToken) {
      firebaseUser = await getAuth().verifyIdToken(authToken);
      authUser = await userDB.findOne({ uuid: firebaseUser?.uid });
    }

    const mediaQuery = () => {
      if (!firebaseUser || firebaseUser.uid !== userId) {
        isNotCurrentAuthUser = true;
        return { userId, public: true };
      }

      return { userId };
    };

    const searchedUser = await userDB.findOne({ uuid: userId });

    const reviewCount = await reviewDB.countDocuments(mediaQuery());
    const listCount = await listDB.countDocuments(mediaQuery());
    const watchedCount = await watchedDB.countDocuments(mediaQuery());

    if (!searchedUser) {
      return {
        success: false,
        error: "unable to find user",
      };
    }

    if (isNotCurrentAuthUser) {
      searchedUser.followers.forEach((followingUser: ObjectId) => {
        if (followingUser.equals(authUser?._id)) {
          isFollowing = true;
        }
      });
    }

    return {
      success: true,
      body: {
        _id: searchedUser._id,
        uuid: searchedUser.uuid,
        username: searchedUser.username,
        bio: searchedUser.bio,
        location: searchedUser.location,
        photoUrl: searchedUser.photoUrl,
        reviewCount,
        listCount,
        watchedCount,
        followerCount: searchedUser.followers.length,
        followingCount: searchedUser.following.length,
        isFollowing,
        countryCode: searchedUser.countryCode,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      body: error.message,
    };
  }
};

export default getUserV2Service;
