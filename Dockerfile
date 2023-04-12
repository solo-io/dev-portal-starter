# FROM node
# COPY ./projects/ui/dist ./dist
# COPY ./projects/ui/package.json .
# WORKDIR . /dev-portal-starter/projects/ui
# ENTRYPOINT ["yarn", "preview"]
FROM node
COPY . /dev-portal-starter
WORKDIR /dev-portal-starter/projects/ui
RUN yarn install
ENTRYPOINT ["yarn", "start"]
