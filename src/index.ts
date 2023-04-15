// eslint-disable-next-line import/no-unresolved
import { initializeApp, cert } from "firebase-admin/app";
import NodeCache from "node-cache";
import { MongoClient } from "mongodb";
import app from "./app";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const certs = require("../cred.json");

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

const PORT = process.env.PORT || 8080;
const host = process.env.DB_HOST || "";

export const firebaseApp = initializeApp({
  credential: cert(certs),
});

export const appCache = new NodeCache({ stdTTL: 3599 });
export const client = new MongoClient(host);

const connectMongoDb = () => {
  client
    .connect()
    .then(() => {
      console.log("mongodb is connected");
    })
    .catch((e) => {
      console.error(e);
    });
};

connectMongoDb();

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
