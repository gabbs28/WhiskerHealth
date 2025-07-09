# Prisma

## Why Prisma over Sequelize

Prisma folder is not directly used it contains the directives to build the client (schema.prisma file)
also contains migrations and a seeder file

I need the prisma client for the backend as well as prisma client enumerations in the frontend for my dropdowns

Since I need the client for both the backend and frontend. I didn't want to have
duplicate directives as that would create a higher maintenance burden

The project isn't set up to use workspaces, so I can't create a package containing the client to be imported
by the backend and frontend which would be ideal. Also backend is using cjs (require / old). The frontend is
using esm (import / new), and I am not sure if it is possible to create a dual-purpose module (also not sure how
to do that).

This project is set up like a monorepo without all the required instrumentation (why I am trying to use nx in my
first attempt since I don't know how to do all that myself). The Prisma folder is broken out and have it generate a
client for the backend using cjs and the frontend using esm to achieve my goal of using it in both places.

This isn't ideal, but I feel that my rational behind this choice is sound.

## Usage

The [package.json](package.json) contains the following helper script to facilitate running the `prisma` commands.

### generate

Generate the database client for `prisma`, `backend`, and `frontend` modules based on the
[schema.prisma](prisma/schema.prisma).

```npm
npm run generate
```

### migrate

Use `prisma` to run any pending migrations.

```npm
npm run migrate
```

### seed

Use `prisma` to seed the database based on [seed.ts](prisma/seed.ts).

```npm
npm run seed
```

### studio

Use `prisma` GUI for database inspection (`studio`).

```npm
npm run studio
```
