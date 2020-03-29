 export default (sequelize,DataTypes) => {
     const User = sequelize.define('user',{
         username:{
             type:DataTypes.STRING,
             unique:true,
             validate:{
                 isAlphanumeric:{
                     args: true,
                     msg:"The username can Only Contain Letters and Numbers"
                 },
                 len:{

                     args:[3,25],
                     msg:"The Username needs to be betwtween 3 and 25 charactrs long "
                 } 
             }
         },email: {
            type: DataTypes.STRING,
            unique: true,
            validate:{
                isEmail:{
                    args:true,
                    msg:"Invalid email"
                }
            }
          },
          password:DataTypes.STRING,



     });
     User.associate = (models)=>{
         // N:M
         User.belongsToMany(models.Team,{
             through:'member',
             foreignKey:{
                 name:'userId',
                 field:'user_id'
             }
         });
         // N:M
      User.belongsToMany(models.Channel, {
        through: 'channel_member',
        foreignKey: {
            name:'userId',
            field:'user_id'
        },
      });
     };

      

     return User;
 }