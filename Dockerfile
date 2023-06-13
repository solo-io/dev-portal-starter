# First stage: build stage
FROM node:16.14.2 AS build-stage

WORKDIR /app
COPY ./projects projects
WORKDIR /app/projects/ui

RUN apt-get update && apt-get install -y build-essential
RUN yarn install && yarn build


# Second stage: runtime stage
FROM node:16.14.2 AS runtime-stage

WORKDIR /app
COPY --from=build-stage /app/projects/ui/dist ./dist
EXPOSE 4000

# Set the entry point
ENTRYPOINT ["vite", "preview", "--port", "4000", "--host"]
