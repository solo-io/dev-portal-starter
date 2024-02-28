FROM node:18.16.0

ENV VITE_PORTAL_SERVER_URL=$VITE_PORTAL_SERVER_URL \
    VITE_CLIENT_ID=$VITE_CLIENT_ID \
    VITE_TOKEN_ENDPOINT=$VITE_TOKEN_ENDPOINT \
    VITE_AUTH_ENDPOINT=$VITE_AUTH_ENDPOINT \
    VITE_APPLIED_OIDC_AUTH_CODE_CONFIG=$VITE_APPLIED_OIDC_AUTH_CODE_CONFIG \
    VITE_OIDC_AUTH_CODE_CONFIG_CALLBACK_PATH=$VITE_OIDC_AUTH_CODE_CONFIG_CALLBACK_PATH \
    VITE_OIDC_AUTH_CODE_CONFIG_LOGOUT_PATH=$VITE_OIDC_AUTH_CODE_CONFIG_LOGOUT_PATH

# Copy files for build
WORKDIR /app
COPY ./projects projects
WORKDIR /app/projects/ui

# Install global dependencies and set up for runtime
RUN apt-get update && apt-get install -y build-essential
RUN yarn install
EXPOSE 4000

# Build the app and pass in the environment variables, then start it.
# The build can't happen in 2 stages (build and runtime),
# since these variables will change when the image is deployed.
ENTRYPOINT VITE_PORTAL_SERVER_URL=$VITE_PORTAL_SERVER_URL \
    VITE_CLIENT_ID=$VITE_CLIENT_ID \
    VITE_TOKEN_ENDPOINT=$VITE_TOKEN_ENDPOINT \
    VITE_AUTH_ENDPOINT=$VITE_AUTH_ENDPOINT \
    VITE_APPLIED_OIDC_AUTH_CODE_CONFIG=$VITE_APPLIED_OIDC_AUTH_CODE_CONFIG \
    VITE_OIDC_AUTH_CODE_CONFIG_CALLBACK_PATH=$VITE_OIDC_AUTH_CODE_CONFIG_CALLBACK_PATH \
    VITE_OIDC_AUTH_CODE_CONFIG_LOGOUT_PATH=$VITE_OIDC_AUTH_CODE_CONFIG_LOGOUT_PATH \
    yarn build && yarn run vite preview --port 4000 --host
