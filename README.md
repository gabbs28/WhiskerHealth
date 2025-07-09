# WhiskerHealth

## Navigation

## Overview

A web application for tracking the health of your beloved Cat.

## Usage

The [package.json](package.json) contains the following helper script to facilitate running the `frontend`.

### format

Use `prettier` to format all files to keep things consistent and standardized.

```npm
npm run format
```

### install

Recursively install all required packages.

```npm
npm install
```

#### install:prisma

Install just packages used by the `prisma` module.

```npm
npm run install
```

#### install:backend

Install just packages used by the `backend` module.

```npm
npm run install:backend
```

#### install:frontend

Install just packages used by the `frontend` module.

```npm
npm run install:frontend
```

### start:backend

Start the `backend` in `development mode.

```npm
npm run start:backend
```

### start:frontend

Start the `frontend` in `development mode.

```npm
npm run start:frontend
```

### start:production

Start in `production` mode.

```npm
npm run start:production
```

### build

Transpile the product to allow for running in production mode.

```npm
npm run build
```

#### build:prisma

Transpile the `prisma` module.

```npm
npm run build:prisma
```

#### build:backend

Transpile the `backend` module.

```npm
npm run build:backend
```

#### build:frontend

Transpile the `frontend` module.

```npm
npm run build:frontend
```

### database:migrate

Run any pending database migrations.

```npm
npm run database:migrate
```

### database:seed

Seed database. This command can be run multiple times; however, it will not "reset" seeded data if present.

```npm
npm run database:seed
```

### database:studio

Launch the GUI for database inspection.

```npm
npm run database:studio
```

## Tech Stack:

The entire project is written in TypeScript.

- Frontend: React
- Backend: Express.js
- Database: PostgreSQL
- Authentication: Implementing secure authentication using industry-standard practices such as hashing and CSRF.
- DevOps: Docker for containerized deployment utilizing multi-stage images, and Amazon Web Services for Image storage.

![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Nodejs](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Mocha](https://img.shields.io/badge/mocha.js-323330?style=for-the-badge&logo=mocha&logoColor=Brown)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Shell Scripting](https://img.shields.io/badge/Shell_Script-121011?style=for-the-badge&logo=gnu-bash&logoColor=white)
![Amazon AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Github Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

## Features

## Acknowledgments
