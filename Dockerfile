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

# Minimal serve base. Google distroless Node 22 has no shell and no package
# manager, which shrinks the OS package surface to near-zero HIGH/CRITICAL CVEs
# and lets CVE-gated pipelines promote the image. Because there is no npm here,
# this stage also drops the `npm install -g npm@latest` self-update step the
# slim base used (its runtime deps are already pinned via the build stage).
#
# The debian13 (trixie) variant is used rather than debian12: bookworm is now
# EOL for security data, and its libssl3/libc6/node were all carrying CVEs with
# fixes we cannot apply here (distroless has no package manager, so bumping the
# base tag is the only lever). debian13 also ships a newer Node 22 patch.
FROM gcr.io/distroless/nodejs22-debian13:nonroot AS serve_stage

# Copy the server files (this includes the built UI).
WORKDIR /app
COPY --from=build_stage /app/projects/server .

EXPOSE 4000

# The distroless image's entrypoint is already `node`, so we exec the server
# directly. The server reads its VITE_* configuration from process.env at
# runtime (injected by your deployment), so no shell-form env re-export is
# needed. We run `node ./bin/www` rather than `yarn start` because running yarn
# mutates a cache file, which fails in read-only environments.
CMD ["/app/bin/www"]
