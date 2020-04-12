import bcrypt from 'bcryptjs';
import _ from 'lodash';
import {tryLogin} from '../auth';
import formatErrors from '../formatErrors';

export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: {
    register: async (parent, args, { models }) => {
      try {

        const user = await models.User.create(args);

        return {
          ok: true,
          user,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    },
    login: (parent,{email,password},{models,SECRET,SECRET2}) => tryLogin(email, password, models, SECRET, SECRET2),



  },
};