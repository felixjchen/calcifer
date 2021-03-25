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

docker run --runtime=sysbox-runc -d --network project-calcifer_default --name=000 --network-alias=000 -e LETSENCRYPT_HOST=000.project-calcifer.ml -e VIRTUAL_HOST=000.project-calcifer.ml felixchen1998/calcifer-playground:kind