# Backend

## Usage

The [package.json](package.json) contains the following helper script to facilitate running the `backend`.

### start:development

Run the `backend` in development mode. Watches code for changes and will reload.

```npm
npm run start:development
```

### build

Use `tsc` to transpile the code for efficient use in `production`.

```npm
npm run start:build
```

### start:production

Run the `backend` is `production` mode (transpiled files).

Notes: `build` must be run for this command to work, and must be re-run after any changes.

```npm
npm run start:production
```
