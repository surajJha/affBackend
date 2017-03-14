FROM node:boron
MAINTAINER Suraj Kumar Jha
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY ./package.json /usr/src/app/
RUN npm install pm2 -g
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 8080
CMD [ "pm2-docker", "index.js" ]