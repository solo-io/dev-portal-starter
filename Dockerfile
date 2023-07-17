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

# Install global dependencies
RUN apt-get update && apt-get install -y build-essential
RUN npm install --global vite@4.2.3

# Build the app and pass in the environment variables.
# The build can't happen in 2 stages (build and runtime),
# since these variables will change when the image is deployed.
RUN yarn install && VITE_PORTAL_SERVER_URL=$VITE_PORTAL_SERVER_URL \
    VITE_CLIENT_ID=$VITE_CLIENT_ID \
    VITE_TOKEN_ENDPOINT=$VITE_TOKEN_ENDPOINT \
    VITE_AUTH_ENDPOINT=$VITE_AUTH_ENDPOINT \
    VITE_LOGOUT_ENDPOINT=$VITE_LOGOUT_ENDPOINT \
    yarn build

# Set up for the runtime
RUN cp -rf /app/projects/ui/dist /app/dist
RUN rm -rf /app/projects
WORKDIR /app
EXPOSE 4000

# Start the production build of the app
ENTRYPOINT vite preview --port 4000 --host
