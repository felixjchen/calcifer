FROM docker:dind
WORKDIR /app

# OS packages
RUN apk update
RUN apk add --update nodejs npm

# Node packages
COPY package*.json ./
RUN npm install
RUN npm install ts-node -g

# We want just VIRTUAL_PATH
EXPOSE 8080
ENV VIRTUAL_PATH=/api/
ENV VIRTUAL_PORT=8080
ENV VIRTUAL_HOST=localhost

# Node API service
COPY . .
CMD [ "ts-node", "app.ts" ]