<================ START   psql  , postgres  =================>

/********* To access psql **************************/
  
 * docker-compose up --build
 * docker exec -it <name of the container with run the db> psql -U postgres

    -for Me it Was :
    -$ docker exec -it react_db_1  psql -U postgres

    To run pg_dump you can use docker exec command:

To backup:

docker exec -u <your_postgres_user> <postgres_container_name> pg_dump -Fc <database_name_here> > db.dump

docker exec    -u postgres react_db_1  pg_dump -Fc slack-clone > slack-clone-dump.sql


To drop db (Don't do it on production, for test purpose only!!!):

docker exec -u <your_postgres_user> <postgres_container_name> psql -c 'DROP DATABASE <your_db_name>'

To restore:

docker exec -i -u <your_postgres_user> <postgres_container_name> pg_restore -C -d postgres < db.dump

docker exec  -i  -u postgres react_db_1  pg_restore -c -d slack-clone < slack-clone-dump.sql


Also you can use docker-compose analog of exec. In that case you can use short services name (postgres) instead of full container name (composeproject_postgres).

docker exec

docker-compose exec

pg_restore

 ********** To connect to the db **************************** 

    $  \c <database_name>

 ********************* to show the tables *******************************

     $  \d

****************************************************************************************/

************************To Drop table **************
DROP TABLE IF EXISTS direct_messages  CASCADE; 

<=================== END   psql  , postgres  ===================>

<====================== START  Git Branch =====================>

Create a new branch:
git checkout -b feature_branch_name
Edit, add and commit your files.
Push your branch to the remote repository:
git push -u origin feature_branch_name

<====================== END  Git Branch =====================>

<======== START DockerFile build image of the project ===========>

# $ docker build -t foushware/slack_clone .    => this to build the image 

# docker run -p 3001:8081 foushware/slack_clone => to run the image inside the container  p=> specify port  port1:port2

# port1 => what i want to run in my computer    |  port2 => what i want to run in the container

<======== END DockerFile build image of the project ===========>
