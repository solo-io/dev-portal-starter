##########################################################
#                                                        #
# Builds the UI, and optionally runs the Express server. #
#                                                        #
##########################################################

#############################
# 1. Build steps            #
#############################

# Install dependencies.
yarn --cwd ./projects/ui
yarn --cwd ./projects/server

# Build the UI.
yarn --cwd ./projects/ui build

# Cleanup old server files if they exist.
rm -rf ./projects/server/public/dist || true

# Move the UI build to the server.
mv ./projects/ui/dist ./projects/server/public/dist

# Copy the index file, and replace the `insertedEnvironmentVariables` variable
# with `<%- VariablesInit %>`, since that variable will be generated when served.
cat ./projects/server/public/dist/index.html |
    sed s/const\ insertedEnvironmentVariables\ =\ {}\;/\<\%-\ VariablesInit\ \%\>/ \
        >./projects/server/public/dist/index.ejs

#############################
# 2. Run steps              #
#############################

if [ "$START_SERVER" != 'false' ]; then
    # Read the environment variables in and then start the server.
    source projects/ui/.env.local
    VITE_PORTAL_SERVER_URL=${VITE_PORTAL_SERVER_URL} \
        VITE_CLIENT_ID=${VITE_CLIENT_ID} \
        VITE_TOKEN_ENDPOINT=${VITE_TOKEN_ENDPOINT} \
        VITE_AUTH_ENDPOINT=${VITE_AUTH_ENDPOINT} \
        VITE_LOGOUT_ENDPOINT=${VITE_LOGOUT_ENDPOINT} \
        yarn --cwd ./projects/server start
fi
