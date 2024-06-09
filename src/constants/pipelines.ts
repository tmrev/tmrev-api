import { tmrev } from "../models/mongodb";

const movieDetailsLookUp = [
  {
    $lookup: {
      from: tmrev.collection.movies,
      localField: "tmdbID",
      foreignField: "id",
      as: "movieDetails",
    },
  },
  {
    $unwind: "$movieDetails",
  },
];

const movieDetailsProjection = {
  movieDetails: {
    id: 1,
    title: 1,
    poster_path: 1,
    backdrop_path: 1,
    release_date: 1,
    genres: 1,
    runtime: 1,
    budget: 1,
    revenue: 1,
  },
};

const basicMovieDetailsProjection = {
  movieDetails: {
    id: 1,
    title: 1,
    poster_path: 1,
    release_date: 1,
  },
};

const movieDetailsProjectionWithCast = {
  movieDetails: {
    credits: 1,
  },
};

const movieDetailsPipeline = [
  ...movieDetailsLookUp,
  {
    $project: {
      _id: 1,
      userId: 1,
      tmdbID: 1,
      title: 1,
      notes: 1,
      public: 1,
      createdAt: 1,
      updatedAt: 1,
      averagedAdvancedScore: 1,
      advancedScore: 1,
      reviewedDate: 1,
      ...movieDetailsProjection,
    },
  },
];

const customProjectMovieDetailsPipeline = (project: any) => [
  ...movieDetailsLookUp,
  {
    $project: {
      _id: 1,
      userId: 1,
      tmdbID: 1,
      title: 1,
      notes: 1,
      public: 1,
      createdAt: 1,
      updatedAt: 1,
      averagedAdvancedScore: 1,
      advancedScore: 1,
      reviewedDate: 1,
      ...movieDetailsProjection,
      ...project,
    },
  },
];

const movieReviewScoreProjection = {
  _id: 1,
  tmdbID: 1,
  createdAt: 1,
  updatedAt: 1,
  averagedAdvancedScore: 1,
  advancedScore: 1,
  reviewedDate: 1,
};

const movieReviewScorePipeline = [
  ...movieDetailsLookUp,
  {
    $project: {
      ...movieReviewScoreProjection,
      ...movieDetailsProjection,
    },
  },
];

const watchedMovieDetailsPipeline = [
  ...movieDetailsLookUp,
  {
    $project: {
      _id: 1,
      userId: 1,
      liked: 1,
      tmdbID: 1,
      ...movieDetailsProjection,
    },
  },
];

const watchedMovieDetailsPipelineFunc = (basic = true) => {
  if (basic) {
    return [
      ...movieDetailsLookUp,
      {
        $project: {
          _id: 1,
          userId: 1,
          liked: 1,
          tmdbID: 1,
          ...basicMovieDetailsProjection,
        },
      },
    ];
  }

  return watchedMovieDetailsPipeline;
};

const watchListSortedDetails = [
  {
    $unwind: {
      path: "$movies",
    },
  },
  {
    $project: {
      tags: "$tags",
      public: "$public",
      description: "$description",
      title: "$title",
      createdAt: "$createdAt",
      updatedAt: "$updatedAt",
      order: "$movies.order",
      userId: "$userId",
      movies: "$movies",
    },
  },
  {
    $lookup: {
      from: "movies",
      localField: "movies.tmdbID",
      foreignField: "id",
      as: "movies",
    },
  },
  {
    $sort: {
      order: 1,
    },
  },
  {
    $group: {
      _id: "$_id",
      title: {
        $first: "$title",
      },
      description: {
        $first: "$description",
      },
      tags: {
        $first: "$tags",
      },
      public: {
        $first: "$public",
      },
      createdAt: {
        $first: "$createdAt",
      },
      updatedAt: {
        $first: "$updatedAt",
      },
      userId: {
        $first: "$userId",
      },
      movies: {
        $push: {
          $first: "$movies",
        },
      },
    },
  },
  {
    $project: {
      _id: 1,
      userId: 1,
      title: 1,
      description: 1,
      public: 1,
      tags: 1,
      createdAt: 1,
      updatedAt: 1,
      movies: {
        id: 1,
        title: 1,
        poster_path: 1,
        backdrop_path: 1,
        release_date: 1,
        genres: 1,
        runtime: 1,
        budget: 1,
        revenue: 1,
      },
    },
  },
];

const watchListPipeline = [
  {
    $lookup: {
      from: tmrev.collection.movies,
      localField: "movies.tmdbID",
      foreignField: "id",
      as: "movies",
    },
  },
  {
    $project: {
      _id: 1,
      userId: 1,
      title: 1,
      description: 1,
      public: 1,
      tags: 1,
      createdAt: 1,
      updatedAt: 1,
      movies: {
        id: 1,
        title: 1,
        poster_path: 1,
        backdrop_path: 1,
        release_date: 1,
        genres: 1,
        runtime: 1,
        budget: 1,
        revenue: 1,
      },
    },
  },
];

const watchedGenrePipeline = [
  ...movieDetailsLookUp,
  {
    $project: {
      _id: 1,
      userId: 1,
      liked: 1,
      tmdbID: 1,
      ...movieDetailsProjection,
    },
  },
];

const movieActorPipeline = [
  ...movieDetailsLookUp,
  {
    $project: {
      _id: 1,
      userId: 1,
      tmdbID: 1,
      title: 1,
      notes: 1,
      public: 1,
      createdAt: 1,
      updatedAt: 1,
      averagedAdvancedScore: 1,
      advancedScore: 1,
      reviewedDate: 1,
      ...movieDetailsProjectionWithCast,
    },
  },
];

export {
  movieDetailsPipeline,
  watchedMovieDetailsPipeline,
  watchListPipeline as watchListDetailsPipeline,
  watchedGenrePipeline,
  movieReviewScorePipeline,
  movieActorPipeline,
  watchedMovieDetailsPipelineFunc,
  watchListSortedDetails,
  customProjectMovieDetailsPipeline,
};
