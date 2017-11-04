FROM node:6.11.4-alpine
RUN mkdir -p /usr/src/app
COPY package.json /usr/src/app
RUN  cd /usr/src/app; npm install
COPY . /usr/src/app
WORKDIR /usr/src/app

CMD npm run start
