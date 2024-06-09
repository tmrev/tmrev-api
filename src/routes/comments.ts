import { Router } from "express";
import getCommentsController from "../controllers/movie/comment/getComments.controller";
import asyncMiddleware from "../middleware/async.middleware";
import createCommentController from "../controllers/movie/comment/createComment.controller";
import getCommentController from "../controllers/movie/comment/getComment.controller";
import {
  createCommentValidation,
  deleteCommentValidation,
  voteCommentValidation,
} from "../validation/comments";
import voteCommentController from "../controllers/movie/comment/voteComment.controller";
import deleteCommentController from "../controllers/movie/comment/deleteComment.controller";

const router: Router = Router();

router.post(
  "/vote/:id",
  voteCommentValidation(),
  asyncMiddleware(voteCommentController)
);

router.post(
  "/:id",
  createCommentValidation(),
  asyncMiddleware(createCommentController)
);

router.delete(
  "/:id",
  deleteCommentValidation(),
  asyncMiddleware(deleteCommentController)
);

router.get("/:id/details", asyncMiddleware(getCommentController));

router.get("/:id", asyncMiddleware(getCommentsController));

const commentsRouter: Router = router;

export default commentsRouter;
