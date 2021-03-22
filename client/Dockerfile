### STAGE 1: Build ###
FROM node:12.16.3-alpine AS build
WORKDIR /usr/src/app

RUN npm install -g @angular/cli 
COPY . .
RUN npm install
RUN ng build --prod

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/client /usr/share/nginx/html
