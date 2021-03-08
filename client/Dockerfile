FROM node:12.2.0
WORKDIR /app 

COPY package.json package.json
RUN npm install
RUN npm install -g @angular/cli@7.3.9
RUN npm install lite-server -g

COPY . .

# We want just VIRTUAL_PATH
EXPOSE 3000
ENV VIRTUAL_PATH=/
ENV VIRTUAL_PORT=3000
ENV VIRTUAL_HOST=localhost

# start app
RUN ng build --prod
CMD lite-server --baseDir="dist/client"