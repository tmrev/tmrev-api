import { getAuth } from "firebase-admin/auth";
import { client } from "../..";

export const createUserService = async (authToken: string) => {
    try {
        const user = await getAuth().verifyIdToken(authToken);
        const db = client.db('Reviews').collection('Users');

        await db.insertOne({ email: user.email, uuid: user.uid })

        return 'success'
    } catch (error) {
        throw error
    }
}