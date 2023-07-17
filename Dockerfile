# First stage: build stage
FROM node:16.14.2 AS build-stage

WORKDIR /app
COPY ./projects projects
WORKDIR /app/projects/ui

# Pass environment variables through
ARG VITE_PORTAL_SERVER_URL
ENV VITE_PORTAL_SERVER_URL $VITE_PORTAL_SERVER_URL

ARG VITE_CLIENT_ID
ENV VITE_CLIENT_ID $VITE_CLIENT_ID

ARG VITE_TOKEN_ENDPOINT
ENV VITE_TOKEN_ENDPOINT $VITE_TOKEN_ENDPOINT

ARG VITE_AUTH_ENDPOINT
ENV VITE_AUTH_ENDPOINT $VITE_AUTH_ENDPOINT

ARG VITE_LOGOUT_ENDPOINT
ENV VITE_LOGOUT_ENDPOINT $VITE_LOGOUT_ENDPOINT

RUN apt-get update && apt-get install -y build-essential
RUN yarn install && \
    VITE_PORTAL_SERVER_URL=$VITE_PORTAL_SERVER_URL \
    VITE_CLIENT_ID=$VITE_CLIENT_ID \
    VITE_TOKEN_ENDPOINT=$VITE_TOKEN_ENDPOINT \
    VITE_AUTH_ENDPOINT=$VITE_AUTH_ENDPOINT \
    VITE_LOGOUT_ENDPOINT=$VITE_LOGOUT_ENDPOINT \
    VITE_TESTING=123 \
    yarn build


# Second stage: runtime stage
FROM node:16.14.2 AS runtime-stage

WORKDIR /app
COPY --from=build-stage /app/projects/ui/dist ./dist
RUN npm install --global vite@4.2.3

EXPOSE 4000

# Set the entry point
ENTRYPOINT vite preview --port 4000 --host
