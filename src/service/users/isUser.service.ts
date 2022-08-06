import { client } from '../..';
import { tmrev } from '../../models/mongodb';

export const isUserService = async (uid: string) => {
    try {

        console.log(uid)

        const db = client.db(tmrev.db).collection(tmrev.collection.users);

        const result = await db.findOne({ uuid: uid })

        if(result) {
            return true
        } else {
            return false
        }

    } catch (error) {
        throw error;
    }
};
