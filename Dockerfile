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
FROM cgr.dev/chainguard/wolfi-base:latest@sha256:08df5982c3d27e70a4ce1607e3bb9af09d746f8722cf135a7694afef879fc5a2 AS serve_stage

# Exact versions, so a rebuild of the same commit gets the same packages.
RUN apk add --no-cache \
    nodejs-22=22.23.2-r1 \
    c-ares=1.34.8-r2 \
    icu78-data-full=78.3-r3 \
    libicu78=78.3-r3 \
    libnghttp2-14=1.70.0-r4 \
    libstdc++=16.2.0-r1 \
    libuv=1.53.0-r0

# Copy the server files (this includes the built UI).
WORKDIR /app
COPY --from=build_stage /app/projects/server .

EXPOSE 4000

# Run as the same nonroot UID as before. Run node directly, since yarn writes a cache file.
USER 65532
ENTRYPOINT ["/usr/bin/node"]
CMD ["/app/bin/www"]
