FROM docker:dind
WORKDIR /app

# OS packages
RUN apk update
RUN apk add --update bash nodejs npm

# Node packages
COPY package*.json ./
RUN npm install
RUN npm install ts-node -g


# Node API service
COPY . .
CMD [ "ts-node", "app.ts" ]
