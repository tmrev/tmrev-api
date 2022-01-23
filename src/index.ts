import app from './app';
import redis from 'redis';
import { initializeApp, cert } from 'firebase-admin/app';
import { MongoClient } from 'mongodb';

const test = require('../cred.json');

require('dotenv').config();

const PORT_REDIS = process.env.PORT_REDIS || 6379;
const PORT = process.env.PORT || 8080;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.DB_HOST;
const projectId = process.env.PROJECT_ID;
const privateKey = process.env.PRIVATE_KEY;
const clientEmail = process.env.CLIENT_EMAIL;

// export const redisClient = redis.createClient({
//   host: 'redis',
//   port: Number(PORT_REDIS),
// });
export const redisClient = redis.createClient(Number(PORT_REDIS));

export const firebaseApp = initializeApp({
  credential: cert(test),
});

const uri = `mongodb+srv://${user}:${password}@${host}`;

export const client = new MongoClient(uri);

const retryConnection = () => {
  client
    .connect()
    .then(() => {
      console.log('mongodb is connected');
    })
    .catch((e) => {
      console.error(e);
      retryConnection();
    });
};

retryConnection();

export const set = (key: string, value: any) => {
  console.log('set');
  redisClient.set(key, JSON.stringify(value));
  redisClient.expire(key, 1800);
};

redisClient.on('connect', () => console.log('redis is connected'));

redisClient.on('error', (err) => console.log(`redis angry ${err}`));

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
