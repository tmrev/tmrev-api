import { ObjectId } from "mongodb"
import { client } from "../.."

export const getPollService = async (id:string) => {
    try {
        const db = client.db('Reviews').collection('Polls')
        const newId = new ObjectId(id)


        const result = await db.findOne({_id: newId})

        return result
    } catch (error) {
        throw error
    }
}

