import { getAuth } from "firebase-admin/auth"
import { Timestamp } from "firebase-admin/firestore"
import { ObjectId } from "mongodb"
import { client } from "../.."
import { tmrev } from "../../models/mongodb"
import { Categories } from "./createPoll.service"

interface UpdatePollPayload {
    _id: ObjectId
    title: string
    description: string
    categories: Categories[]
    creator: string
    createdAt: Timestamp,
    updatedAt: Timestamp,
    active: boolean
}

export const updatePollService = async (authToken: string, pollId: string, data: UpdatePollPayload) => {
    try {
        const user = await getAuth().verifyIdToken(authToken)
        const db = client.db(tmrev.db).collection(tmrev.collection.poll);

        const _id = new ObjectId(pollId);

        const poll = await db.findOne({ _id })

        if (poll && poll.creator !== user.uid) throw new Error('User cannot update this poll or Poll does not exist')

        const newData: UpdatePollPayload = JSON.parse(JSON.stringify(data))

        newData.updatedAt = Timestamp.now()

        await db.updateOne({ _id }, { $set: { newData } })

        return 'success'

    } catch (error) {
        throw error
    }
}