import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

import healthRouter from "./routes/health";
import MovieReviewRouter from "./routes/movieReivew";
import WatchListRouter from "./routes/watchList";
import userRouter from "./routes/user";
import pollRouter from "./routes/poll";
import theNumbersRouter from "./routes/theNumbers";
import movieRouter from "./routes/movie";
import searchRouter from "./routes/search";
import importRouter from "./routes/import";
import notificationsRouter from "./routes/notifications";
import followRouter from "./routes/follow";
import userV2Router from "./routes/v2/userV2";
import movieV2Router from "./routes/v2/movieV2";
import commentsRouter from "./routes/comments";

const shouldCompress = (req: any, res: any) => {
  if (req.headers["x-no-compression"]) {
    // Will not compress responses, if this header is present
    return false;
  }
  // Resort to standard compression
  return compression.filter(req, res);
};

class App {
  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public app: express.Application;

  private config(): void {
    this.app.use(
      compression({
        filter: shouldCompress,
        threshold: 0,
      })
    );
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use(
      helmet({
        contentSecurityPolicy:
          process.env.NODE_ENV === "production" ? undefined : false,
      })
    );
    this.app.use(morgan("combined"));
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      next();
    });
  }

  private routes(): void {
    this.app.use("/health", healthRouter);
    this.app.use("/movie-review", MovieReviewRouter);
    this.app.use("/movie/v2", movieV2Router);
    this.app.use("/movie", movieRouter);
    this.app.use("/watch-list", WatchListRouter);
    this.app.use("/user/v2", userV2Router);
    this.app.use("/user", userRouter);
    this.app.use("/poll", pollRouter);
    this.app.use("/numbers", theNumbersRouter);
    this.app.use("/search", searchRouter);
    this.app.use("/import", importRouter);
    this.app.use("/notification", notificationsRouter);
    this.app.use("/follow", followRouter);
    this.app.use("/comments", commentsRouter);
  }
}

export default new App().app;
