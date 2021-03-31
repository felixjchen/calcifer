# https://hub.docker.com/_/node/
FROM node:alpine
WORKDIR /app

# OS packages
RUN apk update

# Node packages
COPY package*.json ./
RUN npm install
RUN npm install ts-node -g

# Start service
COPY . .
CMD [ "ts-node", "app.ts" ]