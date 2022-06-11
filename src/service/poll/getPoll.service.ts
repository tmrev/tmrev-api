import { ObjectId } from "mongodb"
import { client } from "../.."
import { tmrev } from "../../models/mongodb";

export const getPollService = async (id:string) => {
    try {
        const db = client.db(tmrev.db).collection(tmrev.collection.poll);
        const newId = new ObjectId(id)


        const result = await db.findOne({_id: newId})

        return result
    } catch (error) {
        throw error
    }
}

