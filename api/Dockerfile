FROM docker:dind
WORKDIR /app

# OS packages
RUN apk update
# jq and bash for kindbox
RUN apk add --update jq bash nodejs npm

# Node packages
COPY package*.json ./
RUN npm install
RUN npm install ts-node -g


# Node API service
COPY . .
CMD [ "ts-node", "app.ts" ]
