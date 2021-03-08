FROM node:12.2.0

# We want just VIRTUAL_PATH
ENV VIRTUAL_PATH=/
ENV VIRTUAL_PORT=4200
ENV VIRTUAL_HOST=localhost

WORKDIR /app 

COPY package.json package.json
RUN npm install
RUN npm install -g @angular/cli@7.3.9

COPY . .

# start app
CMD ng serve --prod --host 0.0.0.0 --port 4200