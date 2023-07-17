# First stage: build stage
FROM node:16.14.2 AS build-stage

WORKDIR /app
COPY ./projects/ui .

RUN apt-get update && apt-get install -y build-essential
RUN yarn install

EXPOSE 4000

# Store the environment variables in the image
ENV VITE_PORTAL_SERVER_URL=$VITE_PORTAL_SERVER_URL \
    VITE_CLIENT_ID=$VITE_CLIENT_ID \
    VITE_TOKEN_ENDPOINT=$VITE_TOKEN_ENDPOINT \
    VITE_AUTH_ENDPOINT=$VITE_AUTH_ENDPOINT \
    VITE_LOGOUT_ENDPOINT=$VITE_LOGOUT_ENDPOINT

# Start the app and pass in the environment variables
ENTRYPOINT VITE_PORTAL_SERVER_URL=$VITE_PORTAL_SERVER_URL \
    VITE_CLIENT_ID=$VITE_CLIENT_ID \
    VITE_TOKEN_ENDPOINT=$VITE_TOKEN_ENDPOINT \
    VITE_AUTH_ENDPOINT=$VITE_AUTH_ENDPOINT \
    VITE_LOGOUT_ENDPOINT=$VITE_LOGOUT_ENDPOINT \
    vite start --port 4000 --host
