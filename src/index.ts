// eslint-disable-next-line import/no-unresolved
import { initializeApp, cert } from "firebase-admin/app";
import { MongoClient } from "mongodb";
import app from "./app";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const certs = require("../cred.json");

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

const PORT = process.env.PORT || 8080;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.DB_HOST;

export const firebaseApp = initializeApp({
  credential: cert(certs),
});

const uri = `mongodb+srv://${user}:${password}@${host}`;

export const client = new MongoClient(uri);

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
