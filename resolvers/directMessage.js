import requiresAuth from '../permissions';

const { Op } = require("sequelize");
export default {


    DirectMessage:{
        sender: ({ sender, senderId }, args, { models }) => {
            if (sender) {
              return sender;
            }
      
            return models.User.findOne({ where: { id: senderId } }, { raw: true });
          },
    },
  

    Query: {
        directMessages: requiresAuth.createResolver( async (parent, { teamId, otherUserId }, { models, user }) =>

            models.DirectMessage.findAll(
                {
                 order:[['createdAt','ASC']],
                  where: {
                    teamId,
                    [Op.or]: [
                      {
                        [Op.and]: [{ receiverId: otherUserId }, { senderId: user.id }],
                      },
                      {
                        [Op.and]: [{ receiverId: user.id }, { senderId: otherUserId }],
                      },
                    ],
                  },
                },
                { raw: true },
              )),
      },//query curlly praces :)

    Mutation:{

        createDirectMessage:  requiresAuth.createResolver(async (parent,args,{models,user}) =>{ 

            try {
                
                const directMessage = await models.DirectMessage.create({
                    ...args,
                    senderId: user.id
                });
                console.log(directMessage);
                return true;
            } catch (error) {
               console.log(error);
               return false; 
            }



        }),
    }, 

};