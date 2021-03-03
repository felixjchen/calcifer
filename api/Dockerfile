FROM docker:dind

EXPOSE 8080

# We want just VIRTUAL_PATH
ENV VIRTUAL_PATH=/api/
ENV VIRTUAL_PORT=8080
ENV VIRTUAL_HOST=localhost
ENV LETSENCRYPT_HOST=project-calcifer.ml

WORKDIR /usr/app

# OS packages
RUN apk update
RUN apk add --update nodejs npm

# Node packages
COPY package*.json ./
RUN npm install
RUN npm install ts-node -g

# Node API service
COPY . .
CMD [ "ts-node", "app.ts" ]