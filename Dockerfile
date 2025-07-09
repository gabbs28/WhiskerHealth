# https://hub.docker.com/layers/library/node/22-alpine/images/sha256-3a4802e64ab5181c7870d6ddd8c824c2efc42873baae37d1971451668659483b
# Container starting image
FROM node:22-alpine

# https://stackoverflow.com/questions/40944479/docker-how-to-use-bash-with-an-alpine-based-docker-image
# https://stackoverflow.com/questions/79346057/how-to-install-postgresql-client-17-on-docker-alpine-using-apk
# Bash + PostgreSQL Client
RUN apk --no-cache add \
    bash \
    postgresql-client

# https://docs.docker.com/reference/dockerfile/#env
# Set environment variables with default values that can be overridden at runtime
ENV NODE_ENV=production
ENV PORT=8000
ENV JWT_EXPIRES_IN=604800

# Set environment variables with no default values
# ENV JWT_SECRET=
# DATABASE_URL=

# https://docs.docker.com/reference/dockerfile/#workdir
# Set working directory to "/var/www"
WORKDIR /var/www/

# https://docs.docker.com/reference/dockerfile/#copy
# Copy application with respect to .dockerignore
COPY . .
RUN printenv
# https://docs.docker.com/reference/dockerfile/#run
# https://unix.stackexchange.com/questions/56444/how-do-i-set-an-environment-variable-on-the-command-line-and-have-it-appear-in-c
# Install, build, and then remove non runtime dependencies
# We need to force "development" so that we can build prisma, backend and the frontend
# Migrate the database
# Seed the database
# Once built all development dependecies can be removed
RUN NODE_ENV=development npm install && \
    NODE_ENV=development npm run build && \
    NODE_ENV=development npm run database:migrate && \
    NODE_ENV=development npm run database:seed && \
    NODE_ENV=production npm prune --production

# https://docs.docker.com/reference/dockerfile/#expose
# Expose port used by backend webserver
EXPOSE 8000

# https://docs.docker.com/reference/dockerfile/#cmd
# Start in production mode via package.json script
CMD ["npm", "run", "start:production"]
