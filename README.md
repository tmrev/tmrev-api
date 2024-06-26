# The Movie Review API

Before you get started here make sure you have completed the [tmrev-local-db](https://github.com/tmrev/tmrev-local-db)

## Tech Stack
- Typescript
- Express
- MongoDB


## Development Tools
- VS Code
- Nodejs
- Yarn

## Getting Started
1. clone the github repo `https://github.com/tmrev/tmrev-api.git`
2. create a `.env` file and a `cred.json` file in the root directory

you're `.env` file should look something like this:
```
PORT=8080

DB_HOST="mongodb://localhost:27017"

# firebase auth
PROJECT_ID="
PRIVATE_KEY=""

# the movie database
TMDB_API_KEY=""
```

## Getting Auth Config

Navigate to back your Firebase project Project Settings > Service Account
Click the "Generate new private key"
A JSON file should have been downloaded to your computer (save the file as cred.json)
move it to the root directory of tmrev-api

3. This project utilizes [ESLint](https://eslint.org/) to fix problems, and enforces [Airbnb's](https://airbnb.io/javascript/react/) coding standards. *Please download the plugin for your corresponding IDE*
    - [VS Code Eslint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
4. This application utilizes `yarn`, so make sure you have it installed by running `yarn -v`.
5. In the root of the repo, run `yarn` to install/update dependencies
6. Run `yarn dev` to start the server on `localhost:8080`


## Committing
 - When you make a commit, all stages files will be linted by `eslint` and formatted by `prettier`

## VS Code Extensions
- JavaScript and TypeScript Nightly `ms-vscode.vscode-typescript-next`
- Tailwind CSS IntelliSense `bradlc.vscode-tailwindcss`
- Eslint `dbaeumer.vscode-eslint`
- Prettier - Code formatter `esbenp.prettier-vscode`
- GitLens — Git supercharged `eamodio.gitlens`
