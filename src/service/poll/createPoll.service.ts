import { getAuth } from "firebase-admin/auth"
import { Timestamp } from "firebase-admin/firestore"
import { client } from "../.."
import { tmrev } from "../../models/mongodb"

export interface CreatePollPayload {
    title: string
    description: string,
    categories: Categories[],
}

export type Categories = {
    title: string,
    tmdbId: number,
    votes: string[]
}


export const createPollService = async (authToken: string, payload: CreatePollPayload) => {
    try {
        const db = client.db(tmrev.db).collection(tmrev.collection.poll);
        const user = await getAuth().verifyIdToken(authToken)

        const modPayload = {
            ...payload,
            creator: user.uid,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            active: true
        }

        const {insertedId} = await db.insertOne(modPayload)

        const result = await db.findOne({_id: insertedId})

        return result
    } catch (error) {
        throw error
    }
}

