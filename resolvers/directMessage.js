import requiresAuth from '../permissions';

export default {
    sender: ({ sender, senderId }, args, { models }) => {
        if (sender) {
          return sender;
        }
  
        return models.User.findOne({ where: { id: senderId } }, { raw: true });
      },

    Query:{
        directMessages: requiresAuth.createResolver(async(parent,{teamId,otherUserId},{models,user}) =>
        
        models.DirectMessage.findAll(
            {
                order:[['created_at','ASC']],
                where:{
                    teamId,
                    [models.sequelize.Op.or]:[
                        {
                            [models.sequelize.Op.and]:[{receiverId:otherUserId.id},{senderId:user.id}]
                        },{

                            [models.sequelize.Op.and]:[{receiverId:user.id},{senderId:otherUserId.id}]
                        }
                    ]
                }

            },
            {raw:true}
        ), 
        
        
        
        
        
        
        
        ),
    },

    Mutation:{

        createDirectMessage:  requiresAuth.createResolver(async (parent,args,{models,user}) =>{ 

            try {
                
                const directMessage = await models.DirectMessage.create({
                    ...args,
                    senderId: user.id
                });
                return true;
            } catch (error) {
               console.log(error);
               return false; 
            }



        }),
    }, 

};