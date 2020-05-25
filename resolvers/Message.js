import requiresAuth, { requiresTeamAccess } from '../permissions';

import { withFilter } from 'graphql-subscriptions';
import pubsub from '../pubsub';


const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';
export default {
  Subscription:{
    newChannelMessage :{
      subscribe: requiresTeamAccess.createResolver(withFilter(
        () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
        (payload, args) => 
        // console.log(payload)
         payload.channelId === args.channelId,
      )),
    }
  },
  Message:{
    /** you should have relationship between user and message to use that  */
    user: ({user,userId},args,{models}) => {

    if(user){
      return user;
    }

    return models.User.findOne({where:{id:userId}},{raw:true});
  }
  },
    Mutation: {
      createMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {

        try {
         const message =  await models.Message.create({
            ...args,
            userId: user.id,
          });
          //After creating the message trigger the subscription listeners 
          const asyncFunc = async () => {

            const currentUser = await models.User.findOne({where:{id:user.id}});

            pubsub.publish(NEW_CHANNEL_MESSAGE,{
              //This is the payload to send to the user  ... args is the args in  the schema { channelId:Int!}
              channelId: args.channelId,
              newChannelMessage:{
                ...message.dataValues,
                user: currentUser.dataValues
              }
            })

          }

          asyncFunc();

          return true;
        } catch (err) {
          console.log(err);
          return false;
        }
      }),
    
   
  },
  Query:{
      messages: async (parent,{channelId},{models,user}) =>
      models.Message.findAll({order:[['created_at','ASC']],where:{channelId}},{raw:true})
      
    },
  }