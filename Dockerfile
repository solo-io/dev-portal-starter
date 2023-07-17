FROM node:16.14.2 

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
    yarn start --port 4000 --host




# FROM node:16.14.2

# WORKDIR /app
# COPY ./projects projects
# WORKDIR /app/projects/ui

# RUN apt-get update && apt-get install -y build-essential

# # Store the environment variables in the image
# ENV VITE_PORTAL_SERVER_URL=$VITE_PORTAL_SERVER_URL \
#     VITE_CLIENT_ID=$VITE_CLIENT_ID \
#     VITE_TOKEN_ENDPOINT=$VITE_TOKEN_ENDPOINT \
#     VITE_AUTH_ENDPOINT=$VITE_AUTH_ENDPOINT \
#     VITE_LOGOUT_ENDPOINT=$VITE_LOGOUT_ENDPOINT

# # Start the app and pass in the environment variables
# RUN yarn install && \ 
#     VITE_PORTAL_SERVER_URL=$VITE_PORTAL_SERVER_URL \
#     VITE_CLIENT_ID=$VITE_CLIENT_ID \
#     VITE_TOKEN_ENDPOINT=$VITE_TOKEN_ENDPOINT \
#     VITE_AUTH_ENDPOINT=$VITE_AUTH_ENDPOINT \
#     VITE_LOGOUT_ENDPOINT=$VITE_LOGOUT_ENDPOINT \
#     yarn build

# # # Start the app and pass in the environment variables
# # # (this needs to be in the same docker stage as the runtime)
# # RUN yarn install && \ 
# #     VITE_PORTAL_SERVER_URL=$VITE_PORTAL_SERVER_URL \
# #     VITE_CLIENT_ID=$VITE_CLIENT_ID \
# #     VITE_TOKEN_ENDPOINT=$VITE_TOKEN_ENDPOINT \
# #     VITE_AUTH_ENDPOINT=$VITE_AUTH_ENDPOINT \
# #     VITE_LOGOUT_ENDPOINT=$VITE_LOGOUT_ENDPOINT \
# #     yarn build


# # # Set up for the runtime
# # EXPOSE 4000
# # WORKDIR /app
# # COPY /app/projects/ui/dist ./dist
# # RUN rm -rf /projects
# # RUN npm install --global vite@4.2.3

# # # Set the entry point
# # ENTRYPOINT vite preview --port 4000 --host
