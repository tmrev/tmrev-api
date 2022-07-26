import { getAuth } from "firebase-admin/auth";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

export const createUserService = async (authToken: string, body: any) => {
    try {
        await getAuth().verifyIdToken(authToken);
        const db = client.db(tmrev.db).collection(tmrev.collection.users);

        console.log(body)

        await db.insertOne(body)

        return 'success'
    } catch (error) {
        throw error
    }
}