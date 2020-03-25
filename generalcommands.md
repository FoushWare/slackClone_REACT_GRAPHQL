<================ START   psql  ,  postgres  =================>



/********* To access psql **************************/
  
 * docker-compose up --build
 * docker exec -it <name of the container with run the db> psql -U postgres
    -for Me it Was :
    -$ docker exec -it slack-clone_db_1  psql -U postgres

 ********** To connect to the db **************************** 
    $  \c <database_name>

 ********************* to show the tables *******************************
     $  \d
****************************************************************************************/

<=================== END   psql  ,  postgres  ===================>



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
