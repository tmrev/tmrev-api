import { getAuth } from "firebase-admin/auth"
import { Timestamp } from "firebase-admin/firestore"
import { ObjectId } from "mongodb"
import { client } from "../.."
import { tmrev } from "../../models/mongodb"
import { Categories } from "./createPoll.service"

interface Poll {
    _id?: ObjectId
    title: string
    description: string
    categories: Categories[]
    creator: string
    createdAt: Timestamp,
    updatedAt: Timestamp,
    active: boolean
}

export const votePollService = async (authToken: string, pollId: string, voteCategory: string) => {
    try {
        const user = await getAuth().verifyIdToken(authToken)
        const db = client.db(tmrev.db).collection(tmrev.collection.poll);

        const _id = new ObjectId(pollId);

        const poll = await db.findOne({ _id }) as Poll || null

        if (!poll) throw new Error('Poll does not exist')

        let newPoll: Poll = JSON.parse(JSON.stringify(poll))


        newPoll.categories.forEach((category, index) => {
            if (category.votes.includes(user.uid)) {
                category.votes.forEach((vote, voteIndex) => {
                    category.votes.splice(voteIndex, 1)
                })
                console.log(category, index)

                newPoll.categories[index].votes = [...new Set(category.votes)]
                console.log(newPoll.categories[index].votes)
            }
        })


        newPoll.updatedAt = Timestamp.now()
        const index = newPoll.categories.findIndex((category) => category.title === voteCategory)

        delete newPoll._id

        newPoll.categories[index].votes.push(user.uid)

        await db.updateOne({ _id }, { $set: { ...newPoll } })

        const result = await db.findOne({_id }) as Poll

        return result

    } catch (error) {
        throw error
    }
}