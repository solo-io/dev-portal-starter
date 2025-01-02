##########################################################
#                                                        #
# Builds the UI, and optionally runs the Express server. #
#                                                        #
##########################################################

#############################
# 1. Build steps            #
#############################

# Configure timeout (this is needed for QEMU emulation when doing multi-arch builds, since those are slower)
yarn config set network-timeout 600000 -g

# Install dependencies.
yarn --cwd ./projects/ui || exit 1
yarn --cwd ./projects/server || exit 1

# Build the UI.
yarn --cwd ./projects/ui build || exit 1

# Cleanup old server files if they exist.
rm -rf ./projects/server/public/dist || true

# Make sure the public folder is there.
mkdir -p ./projects/server/public || true

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
