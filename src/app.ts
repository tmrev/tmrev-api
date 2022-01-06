import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import { healthRouter } from './routes/health';
import { PageRouter } from './routes/page';
import { RottenRouter } from './routes/rottenTomatoes';
import { ImdbRouter } from './routes/imdb';
import { MovieRouter } from './routes/movieReivew';
import { WatchListRouter } from './routes/watchList';
import { userRouter } from './routes/user';

class App {
  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public app: express.Application;

  private config(): void {
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use(
      helmet({
        contentSecurityPolicy:
          process.env.NODE_ENV === 'production' ? undefined : false,
      })
    );
    this.app.use(morgan('combined'));
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      next();
    });
  }

  private routes(): void {
    this.app.use('/health', healthRouter);
    this.app.use('/page', PageRouter);
    this.app.use('/rotten', RottenRouter);
    this.app.use('/imdb', ImdbRouter);
    this.app.use('/movie', MovieRouter);
    this.app.use('/watch-list', WatchListRouter);
    this.app.use('/user', userRouter);
  }
}

export default new App().app;
