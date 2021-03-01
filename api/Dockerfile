# https://hub.docker.com/_/node/
FROM node:alpine
ENV VIRTUAL_HOST=localhost
WORKDIR /usr/app

# OS packages
RUN apk update

# Node packages
COPY package*.json ./
RUN npm install
RUN npm install ts-node -g

COPY . .

EXPOSE 8080
CMD [ "ts-node", "app.ts" ]