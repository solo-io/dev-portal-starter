FROM node
COPY ./projects/ui/dist ./dist
COPY ./projects/ui/package.json .
WORKDIR .
RUN yarn install
ENTRYPOINT ["yarn", "preview"]