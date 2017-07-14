FROM forumi0721alpinearmhf/alpine-armhf-nodejs
RUN mkdir -p /usr/src/app
COPY package.json /usr/src/app
RUN  cd /usr/src/app; npm install
COPY . /usr/src/app
WORKDIR /usr/src/app

CMD npm run start
