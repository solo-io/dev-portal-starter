###############
#             #
# Build Stage #
#             #
###############

FROM node:24 AS build_stage

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
RUN START_SERVER=false sh ./scripts/startup.sh

################
#              #
# Server Stage #
#              #
################

# A small static file server written in Go, with no dependencies.
FROM --platform=$BUILDPLATFORM golang:1-alpine AS server_stage
ARG TARGETOS TARGETARCH
WORKDIR /src
COPY ./projects/server/go.mod ./projects/server/*.go ./
RUN CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH go build -trimpath -ldflags="-s -w" -o /server .

###############
#             #
# Serve Stage #
#             #
###############

# Distroless static base: no shell or package manager, just the server and the UI build.
FROM cgr.dev/chainguard/static:latest AS serve_stage

WORKDIR /app
COPY --from=server_stage /server /app/server
COPY --from=build_stage /app/projects/server/public/dist /app/public/dist

EXPOSE 4000

# Run as the same nonroot UID as before.
USER 65532
ENTRYPOINT ["/app/server"]
