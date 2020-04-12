import formatErrors from '../formatErrors';
import requiresAuth from '../permissions';
export default {
    Mutation: {
        //requiresAuth resolves first 
        createTeam: requiresAuth.createResolver( async (parent,args,{models,user}) => {
            try{
                await models.Team.create({...args,owner:user.id});
                return {
                    ok: true,
                };

            }catch(err){
                console.log(err);
                return {
                    ok: false,
                    errors: formatErrors(err),
                }
            }
        }),
    },
        

};

   


