import requiresAuth, { directMessageSubscription } from '../permissions';
import pubsub from '../pubsub';
const { Op } = require("sequelize");
import { withFilter } from 'graphql-subscriptions';


const NEW_DIRECT_MESSAGE = 'NEW_DIRECT_MESSAGE';

// const pubsub = new PubSub();

export default {
 Subscription: {
    newDirectMessage: {
      subscribe: directMessageSubscription.createResolver(withFilter(
        () => pubsub.asyncIterator(NEW_DIRECT_MESSAGE),
        (payload, args, { user }) => {

          console.log("payload  senderId : " + payload.senderId);
          console.log("payload receiverId is : " + payload.receiverId);
          console.log("user id is : " + user.id)
          return payload.teamId === args.teamId &&
            ((payload.senderId === user.id && payload.receiverId === args.userId) ||
              (payload.senderId === args.userId && payload.receiverId === user.id))
        }
      )),
    },
  },
 

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

                const asyncFunc = async () => {


                  const test = await pubsub.publish(NEW_DIRECT_MESSAGE, {
                    
                   
                     teamId: args.teamId,
                     senderId: user.id,
                     receiverId: args.receiverId,

                     newDirectMessage: {
                       ...directMessage.dataValues,
                       sender: {
                         username: user.username,
                       },
                     },



                   }); 

                   console.log('test is ' + test);
                }

                asyncFunc();
                console.log("After pubsub.publish");


                return true;
            } catch (error) {
               console.log(error);
               return false; 
            }



        }),
    }, 

};