/* eslint-disable import/prefer-default-export */
import { PostTypes } from "./tmdb/comments";

type ContentType = PostTypes.COMMENTS | PostTypes.REVIEWS;

export type { ContentType };
