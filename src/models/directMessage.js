export default (sequelize,DataTypes) => {


    const DirectMessage = sequelize.define(
        'direct_message',{
            text:DataTypes.STRING
        }

    );

    DirectMessage.associate = (models) => {

        // M:1
        DirectMessage.belongsTo(models.Team,{
            foreignKey:{
                name:'teamId',
                field:'team_id',
            }
        });


        //M:1
        DirectMessage.belongsTo(models.User,{
            foreignKey:{
                name:'receiverId',
                field:'receiver_id'
            }
        });

        // M:1 
        DirectMessage.belongsTo(models.User,{
            foreignKey:{
                name:'senderId',
                field:'sender_id'
            }
        });








    }


return DirectMessage;


};