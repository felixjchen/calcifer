
### STAGE 1: Build ###
FROM node:12.16.3-alpine AS build
ARG environment=production

WORKDIR /usr/src/app

RUN npm install -g @angular/cli 
COPY . .
RUN npm install
RUN node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --source-map=false --configuration=${environment}

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/client /usr/share/nginx/html
