import { getAuth } from "firebase-admin/auth";
import { client } from "../..";



export const updateUserService = async (authToken: string, data: any) => {
    try {
        const user = await getAuth().verifyIdToken(authToken);
        const db = client.db('Reviews').collection('Users');

        const dbUser = await db.findOne({ email: user.email, uuid: user.uid })

        if (!dbUser) {
          throw new Error('no user found')
        }

        const newData = {
            ...dbUser,
            ...data
        }

        await db.updateOne({email: user.email, uuid: user.uid}, {$set: newData})

        return 'success'
    } catch (error) {
        throw error
    }
}