# what is say here is please install this package inside my little computer [this docker image]
FROM node:9
WORKDIR /app
COPY package-lock.json .
COPY package.json .
RUN npm install
COPY dist .
COPY wait-for-it.sh .
CMD node index.js
# $ docker build -t foushware/slack_clone .    => this to build the image 
# docker run -p 3001:8081 foushware/slack_clone => to run the image inside the container  p=> specify port  port1:port2
# port1 => what i want to run in my computer    |  port2 => what i want to run in the container
