import { checkSchema } from 'express-validator';

export const watchListUpdateValidationRules = () => {
    return checkSchema({
        description: {
            isString: true,
            errorMessage: "Description must be a string",
        },
        public: {
            isBoolean: true,
            errorMessage: "Public must be a boolean",
        },
        title: {
            isString: true,
            errorMessage: "Title must be a string",
        },
        Authorization: {
            isString: true,
            in: ['headers'],
            errorMessage: "Authorization is required",
        },
        movies: {
            isArray: true,
            errorMessage: "Movies is required"
        },
        userId: {
            isString: true,
            errorMessage: "userId is required"
        },
    })
}