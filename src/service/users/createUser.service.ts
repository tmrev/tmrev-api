import { getAuth } from "firebase-admin/auth";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

export const createUserService = async (authToken: string) => {
    try {
        const user = await getAuth().verifyIdToken(authToken);
        const db = client.db(tmrev.db).collection(tmrev.collection.users);

        await db.insertOne({ email: user.email, uuid: user.uid })

        return 'success'
    } catch (error) {
        throw error
    }
}