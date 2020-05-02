import requiresAuth from '../permissions';

export default {
  Message:{
    /** you should have relationship between user and message to use that  */
    user: ({userId},args,{models}) => 
    models.User.findOne({where:{id:userId}},{raw:true}),
  },
    Mutation: {
      createMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {

        try {
          await models.Message.create({
            ...args,
            userId: user.id,
          });
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