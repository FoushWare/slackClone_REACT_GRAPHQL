import requiresAuth, { requiresTeamAccess } from '../permissions';

import { withFilter } from 'graphql-subscriptions';
import pubsub from '../pubsub';


const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';
export default {
  Subscription: {
    newChannelMessage: {
      subscribe: requiresTeamAccess.createResolver(withFilter(
        () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
        (payload, args) =>
          // console.log(payload)
          payload.channelId === args.channelId,
      )),
    }
  },
  Message: {
    /** you should have relationship between user and message to use that  */
    user: ({ user, userId }, args, { models }) => {

      if (user) {
        return user;
      }

      return models.User.findOne({ where: { id: userId } }, { raw: true });
    },
    url:parent => (parent.url? `http://localhost:8081/${parent.url}` : parent.url),
  },
  Mutation: {
    createMessage: requiresAuth.createResolver(async (parent, { file, ...args }, { models, user }) => {

      try {
        const messageData = args;
        if (file) {
          messageData.filetype = file.type;
          messageData.url = file.path;
        }
        const message = await models.Message.create({
          ...messageData,
          userId: user.id,
        });
        //After creating the message trigger the subscription listeners 
        const asyncFunc = async () => {

          const currentUser = await models.User.findOne({ where: { id: user.id } });

          pubsub.publish(NEW_CHANNEL_MESSAGE, {
            //This is the payload to send to the user  ... args is the args in  the schema { channelId:Int!}
            channelId: args.channelId,
            newChannelMessage: {
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
  Query: {
    messages: requiresAuth.createResolver(async (parent, { offset,channelId }, { models, user }) => {
      const channel = await models.Channel.findOne({ raw: true, where: { id: channelId } });

      if (!channel.public) {
        const member = await models.PCMember.findOne({
          raw: true,
          where: { channelId, userId: user.id },
        });
        if (!member) {
          throw new Error('Not Authorized');
        }
      }

      return models.Message.findAll(
        { order: [['created_at', 'ASC']], where: { channelId },limit:35,offset },
        { raw: true },
        );
      }),


  },
}