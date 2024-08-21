#############################
#
# Builds the UI, and runs the Express server for it.
#
#############################

#############################
# 1. Build steps
#############################

# Build the UI.
yarn --cwd ./projects/ui build

# Cleanup old server files if they exist.
rm -rf ./projects/server/public/dist || true

# Move the UI build to the server.
mv ./projects/ui/dist ./projects/server/public/dist

# Copy the index file and add in the `insertedEnvironmentVariables` variable.
cat ./projects/server/public/dist/index.html |
    sed s/\<body\>/\<body\>\<script\ type=\"text\\/javascript\"\>\<\%-\ VariablesInit\ \%\>\<\\/script\>/ \
        >./projects/server/public/dist/index.ejs

#############################
# 2. Run steps
#############################

# Read the environment variables.
source projects/ui/.env.local
VITE_PORTAL_SERVER_URL=${VITE_PORTAL_SERVER_URL} \
    VITE_CLIENT_ID=${VITE_CLIENT_ID} \
    VITE_TOKEN_ENDPOINT=${VITE_TOKEN_ENDPOINT} \
    VITE_AUTH_ENDPOINT=${VITE_AUTH_ENDPOINT} \
    VITE_LOGOUT_ENDPOINT=${VITE_LOGOUT_ENDPOINT} \
    yarn --cwd ./projects/server start
