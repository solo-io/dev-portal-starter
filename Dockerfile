FROM node:16.14.2 

ENV VITE_PORTAL_SERVER_URL=$VITE_PORTAL_SERVER_URL \
    VITE_CLIENT_ID=$VITE_CLIENT_ID \
    VITE_TOKEN_ENDPOINT=$VITE_TOKEN_ENDPOINT \
    VITE_AUTH_ENDPOINT=$VITE_AUTH_ENDPOINT \
    VITE_LOGOUT_ENDPOINT=$VITE_LOGOUT_ENDPOINT

# Copy files for build
WORKDIR /app
COPY ./projects projects
WORKDIR /app/projects/ui

# Install global dependencies and set up for runtime
RUN apt-get update && apt-get install -y build-essential
RUN yarn global add vite@4.2.3
RUN yarn install
EXPOSE 4000

# Build the app and pass in the environment variables, then start it.
# The build can't happen in 2 stages (build and runtime),
# since these variables will change when the image is deployed.
ENTRYPOINT VITE_PORTAL_SERVER_URL=$VITE_PORTAL_SERVER_URL \
    VITE_CLIENT_ID=$VITE_CLIENT_ID \
    VITE_TOKEN_ENDPOINT=$VITE_TOKEN_ENDPOINT \
    VITE_AUTH_ENDPOINT=$VITE_AUTH_ENDPOINT \
    VITE_LOGOUT_ENDPOINT=$VITE_LOGOUT_ENDPOINT \
    yarn build && vite preview --port 4000 --host
