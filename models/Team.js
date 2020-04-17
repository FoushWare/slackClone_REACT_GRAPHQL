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
            through:models.Member,
            foreignKey:{
                name:'teamId',
                field:'Team_id'
            }
        });
        Team.belongsTo(models.User,{
            foreignKey: 'owner',
        })
    };
    return Team;
}