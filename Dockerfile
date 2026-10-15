###############
#             #
# Build Stage #
#             #
###############

FROM node:22.22.2 AS build_stage

# Install global dependencies.
RUN apt-get update && apt-get install -y build-essential

# Copy all project files.
WORKDIR /app
COPY ./projects projects
COPY ./scripts scripts

# Run the startup script, without starting the server.
# This script:
#  - Installs dependencies.
#  - Builds the UI.
#  - Moves the UI build folder to the server project.
#  - Inserts an EJS view engine variable into the UI build,
#    so that the server can send the live environment variables
#    along with the UI when the build is served.
RUN START_SERVER=false sh ./scripts/startup.sh

###############
#             #
# Serve Stage #
#             #
###############

# Wolfi base with only Node 22 added, to keep the OS CVE count low.
FROM cgr.dev/chainguard/wolfi-base:latest@sha256:256c88bb066424045021090932d50be93c8e3f2ce3586707702a401b146f3e43 AS serve_stage

# nodejs-22 holds the major version; no exact revision, so security fixes land on rebuild.
RUN apk add --no-cache nodejs-22

# Copy the server files (this includes the built UI).
WORKDIR /app
COPY --from=build_stage /app/projects/server .

EXPOSE 4000

# Run as the same nonroot UID as before. Run node directly, since yarn writes a cache file.
USER 65532
ENTRYPOINT ["/usr/bin/node"]
CMD ["/app/bin/www"]
