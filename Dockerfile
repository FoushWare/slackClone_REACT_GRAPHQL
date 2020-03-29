# what is say here is please install this package inside my little computer [this docker image]
FROM node:12
WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json

RUN npm install
RUN npm install -g nodemon



CMD ["nodemon","--exec","babel-node","index"]
# $ docker build -t foushware/slack_clone .    => this to build the image 
# docker run -p 3001:8081 foushware/slack_clone => to run the image inside the container  p=> specify port  port1:port2
# port1 => what i want to run in my computer    |  port2 => what i want to run in the container
