##########################################################
#                                                        #
# Builds the UI, and optionally runs the Go server.      #
#                                                        #
##########################################################

#############################
# 1. Build steps            #
#############################

# Configure timeout (this is needed for QEMU emulation when doing multi-arch builds, since those are slower)
yarn config set network-timeout 600000 -g

# Install dependencies.
yarn --cwd ./projects/ui || exit 1

# Build the UI.
yarn --cwd ./projects/ui build || exit 1

# Cleanup old server files if they exist.
rm -rf ./projects/server/public/dist || true

# Make sure the public folder is there.
mkdir -p ./projects/server/public || true

# Move the UI build to the server.
# The server fills in `insertedEnvironmentVariables` in index.html when it starts.
mv ./projects/ui/dist ./projects/server/public/dist

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
        go -C ./projects/server run .
fi
