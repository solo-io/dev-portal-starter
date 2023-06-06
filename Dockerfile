FROM --platform=linux/amd64 node:16
COPY ./projects/ui/dist ./dist
WORKDIR .
RUN ["npm", "install", "vite@4.2.3", "-g"]
ENTRYPOINT ["vite", "preview", "--port", "4000"]
