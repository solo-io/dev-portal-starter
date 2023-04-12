FROM node
COPY ./projects/ui/dist ./dist
WORKDIR .
ENTRYPOINT ["npx", "vite@4.2.1", "preview", "--port", "4000"]