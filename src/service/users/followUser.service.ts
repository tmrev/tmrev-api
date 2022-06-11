import { getAuth } from "firebase-admin/auth";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

export const followUserService = async (authToken: string, userId: string) => {
    try {
        const user = await getAuth().verifyIdToken(authToken)
        const db = client.db(tmrev.db).collection(tmrev.collection.users);
        let result = {}

        const userDoc = await db.findOne({ uuid: user.uid })
        
        if (userDoc) {
            if (userDoc.following && userDoc.following.includes(userId)) {
                await db.updateOne({ uuid: user.uid }, { $pull: { "following": userId } })
                result = 'unfollowed'
            } else {
                await db.updateOne({ uuid: user.uid }, { $addToSet: { "following": userId } })
                result = 'followed'
            }
        }

        return result
    } catch (error) {
        throw error
    }
}