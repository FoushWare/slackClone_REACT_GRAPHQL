 /*Here we make connection to the DB and make association 
 of the relations between tables  [one-to-one,one-to-many and so on]


/**
 * ***************** To access psql ************************************
  
 * docker-compose up --build
 * docker exec -it <name of the container with run the db> psql -U postgres
    -for Me it Was :
    -$ docker exec -it slack-clone_db_1  psql -U postgres

 *********************** To connect to the db ************************** 
    $  \c <database_name>

 ********************* to show the tables *******************************
     $  \d
****************************************************************************************/



import Sequelize from 'sequelize';

//connect to postgresSQL DATABASE 
// test database name : testslack  original one name : slack-clone
const sequelize = new Sequelize(process.env.TEST_DB ||'testslack','postgres','postgres',{
    host:"db",
    pool:{
        max:9,
        min:0,
        idle:10000
    },
    dialect: 'postgres',
    define:{
        underscored: true,
    }
});
// Database Object 
const models = {
    User:sequelize.import('./User'),
    Message:sequelize.import('./Message'),
    Team:sequelize.import('./Team'),
    Channel:sequelize.import('./Channel'),
    Member: sequelize.import('./member'),
    DirectMessage: sequelize.import('./directMessage'),

};
Object.keys(models).forEach((modelName) =>{
    if('associate' in models[modelName]){
        models[modelName].associate(models);
    }
});
models.sequelize=sequelize;
models.Sequelize=Sequelize;

export default models;