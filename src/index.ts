import app from './app';
import redis from 'redis';
import cron from 'cron';
import request from 'request-promise';
require('dotenv').config();

const PORT_REDIS = process.env.PORT_REDIS || 6379;
const PORT = process.env.PORT || 8080;

// export const redisClient = redis.createClient({
//   host: 'redis',
//   port: Number(PORT_REDIS),
// });

export const redisClient = redis.createClient(Number(PORT_REDIS));

export const set = (key: string, value: any) => {
  console.log('set');
  redisClient.set(key, JSON.stringify(value));
  redisClient.expire(key, 1800);
};

redisClient.on('connect', () => console.log('redis is connected'));

redisClient.on('error', (err) => console.log(`redis angry ${err}`));

const job = new cron.CronJob(
  '5 4 * * sun',
  () => request({ url: 'http://localhost:8080/health' }),
  null,
  true,
  'America/Los_Angeles'
);

job.start();

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
