FROM node
COPY . /dev-portal-starter
WORKDIR /dev-portal-starter/projects/ui
RUN yarn install
ENTRYPOINT ["yarn", "start"]