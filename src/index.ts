import app from './app';
import { initializeApp, cert } from 'firebase-admin/app';
import { MongoClient } from 'mongodb';


const certs = require('../cred.json');

require('dotenv').config();

const PORT_REDIS = process.env.PORT_REDIS || 6379;
const PORT = process.env.PORT || 8080;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.DB_HOST;
const projectId = process.env.PROJECT_ID;
const privateKey = process.env.PRIVATE_KEY;
const clientEmail = process.env.CLIENT_EMAIL;


export const firebaseApp = initializeApp({
  credential: cert(certs),
});

const uri = `mongodb+srv://${user}:${password}@${host}`;

export const client = new MongoClient(uri);

const connectMongoDb = () => {
  client
    .connect()
    .then(() => {
      console.log('mongodb is connected');
    })
    .catch((e) => {
      console.error(e);
    });
};

connectMongoDb();

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
