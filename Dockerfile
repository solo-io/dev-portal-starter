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

# Minimal serve base using node:22-slim with security updates applied.
# We use the slim variant rather than distroless to allow apt-get upgrade,
# which fixes libssl3t64 CVEs that cannot be patched in distroless (no package
# manager). The runtime stage runs apt-get upgrade to apply all available
# security patches before copying in the application.
FROM node:22-slim AS serve_stage

# Apply all available security updates to fix libssl3t64 and other OS package CVEs.
# Run as root to perform the upgrade, then switch to node user for runtime.
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy the server files (this includes the built UI).
WORKDIR /app
COPY --from=build_stage /app/projects/server .

# Switch to non-root node user for runtime security
USER node

EXPOSE 4000

# The server reads its VITE_* configuration from process.env at runtime
# (injected by your deployment), so no shell-form env re-export is needed.
# We run `node ./bin/www` rather than `yarn start` because running yarn
# mutates a cache file, which fails in read-only environments.
CMD ["node", "/app/bin/www"]
