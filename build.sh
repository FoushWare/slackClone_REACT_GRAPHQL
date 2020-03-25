#!/bin/bash
#build the image of the project [transfer the project folders to docker and perform yarn insall and yarn start ]
# then run the docker-compose.yml [which run the project_container  && the postgres server and database ]
sudo docker build -t foushware/slack_clone . ; docker-compose up --build;

#   TODO: < install all packages globally > so not to install it everytime from the internet :Problem  :( i want to solve it later 
# sudo npm  -g  install;sudo docker build -t foushware/slack_clone . ; docker-compose up --build
