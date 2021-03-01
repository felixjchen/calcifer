# https://hub.docker.com/_/node/
FROM node:alpine

EXPOSE 8080
ENV VIRTUAL_PATH=/ssh
ENV VIRTUAL_HOST=localhost
WORKDIR /usr/app

# OS packages
RUN apk update

# Node packages
COPY package*.json ./
RUN npm install
RUN npm install ts-node -g

COPY . .

CMD [ "ts-node", "app.ts" ]