export default (sequelize,DataTypes) => {
    const Team = sequelize.define('team',{
        name:{
            type:DataTypes.STRING,
            unique:true,
        }

    });
    Team.associate = (models)=>{
        // N:M
        Team.belongsToMany(models.User,{
            through:'member',
            foreignKey:{
                name:'TeamId',
                field:'Team_id'
            }
        });
        Team.belongsTo(models.User,{
            foreignKey:'owner'
        })
    };
    return Team;
}