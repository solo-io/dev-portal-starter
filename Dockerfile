###############
#             #
# Build Stage #
#             #
###############

FROM node:18.16.0 AS build_stage

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

FROM node:18.16.0 AS serve_stage

ENV VITE_PORTAL_SERVER_URL=$VITE_PORTAL_SERVER_URL \
    VITE_CLIENT_ID=$VITE_CLIENT_ID \
    VITE_TOKEN_ENDPOINT=$VITE_TOKEN_ENDPOINT \
    VITE_AUTH_ENDPOINT=$VITE_AUTH_ENDPOINT \
    VITE_LOGOUT_ENDPOINT=$VITE_LOGOUT_ENDPOINT \
    VITE_APPLIED_OIDC_AUTH_CODE_CONFIG=$VITE_APPLIED_OIDC_AUTH_CODE_CONFIG \
    VITE_OIDC_AUTH_CODE_CONFIG_CALLBACK_PATH=$VITE_OIDC_AUTH_CODE_CONFIG_CALLBACK_PATH \
    VITE_OIDC_AUTH_CODE_CONFIG_LOGOUT_PATH=$VITE_OIDC_AUTH_CODE_CONFIG_LOGOUT_PATH \
    VITE_SWAGGER_CONFIG_URL=$VITE_SWAGGER_CONFIG_URL \
    VITE_AUDIENCE=$VITE_AUDIENCE \
    VITE_HOME_IMAGE_URL=$VITE_HOME_IMAGE_URL \
    VITE_APIS_IMAGE_URL=$VITE_APIS_IMAGE_URL \
    VITE_LOGO_IMAGE_URL=$VITE_LOGO_IMAGE_URL \
    VITE_COMPANY_NAME=$VITE_COMPANY_NAME \
    VITE_CUSTOM_PAGES=$VITE_CUSTOM_PAGES \
    VITE_SWAGGER_PREFILL_API_KEY=$VITE_SWAGGER_PREFILL_API_KEY \
    VITE_SWAGGER_PREFILL_OAUTH=$VITE_SWAGGER_PREFILL_OAUTH \
    VITE_SWAGGER_PREFILL_BASIC=$VITE_SWAGGER_PREFILL_BASIC

# Copy the server files, (this includes the UI build).
WORKDIR /app
COPY --from=build_stage /app/projects/server .

# Pass through the environment variables, and then start the server.
# These variables will change when the image is deployed.
# This needs to be `node ./bin/www` instead of `yarn start because
# running yarn causes a yarn cache file to change, which doesn't work
# in read-only environments.
ENTRYPOINT VITE_PORTAL_SERVER_URL=$VITE_PORTAL_SERVER_URL \
    VITE_CLIENT_ID=$VITE_CLIENT_ID \
    VITE_TOKEN_ENDPOINT=$VITE_TOKEN_ENDPOINT \
    VITE_AUTH_ENDPOINT=$VITE_AUTH_ENDPOINT \
    VITE_LOGOUT_ENDPOINT=$VITE_LOGOUT_ENDPOINT \
    VITE_APPLIED_OIDC_AUTH_CODE_CONFIG=$VITE_APPLIED_OIDC_AUTH_CODE_CONFIG \
    VITE_OIDC_AUTH_CODE_CONFIG_CALLBACK_PATH=$VITE_OIDC_AUTH_CODE_CONFIG_CALLBACK_PATH \
    VITE_OIDC_AUTH_CODE_CONFIG_LOGOUT_PATH=$VITE_OIDC_AUTH_CODE_CONFIG_LOGOUT_PATH \
    VITE_SWAGGER_CONFIG_URL=$VITE_SWAGGER_CONFIG_URL \
    VITE_AUDIENCE=$VITE_AUDIENCE \
    VITE_HOME_IMAGE_URL=$VITE_HOME_IMAGE_URL \
    VITE_APIS_IMAGE_URL=$VITE_APIS_IMAGE_URL \
    VITE_LOGO_IMAGE_URL=$VITE_LOGO_IMAGE_URL \
    VITE_COMPANY_NAME=$VITE_COMPANY_NAME \
    VITE_CUSTOM_PAGES=$VITE_CUSTOM_PAGES \
    VITE_SWAGGER_PREFILL_API_KEY=$VITE_SWAGGER_PREFILL_API_KEY \
    VITE_SWAGGER_PREFILL_OAUTH=$VITE_SWAGGER_PREFILL_OAUTH \
    VITE_SWAGGER_PREFILL_BASIC=$VITE_SWAGGER_PREFILL_BASIC \
    node ./bin/www
