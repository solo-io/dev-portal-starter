FROM --platform=linux/amd64 node:16
COPY ./projects/ui/dist ./dist
WORKDIR .
ENTRYPOINT ["npx", "vite@4.2.1", "preview", "--port", "4000"]