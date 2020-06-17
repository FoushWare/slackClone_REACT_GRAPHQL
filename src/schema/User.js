export default `

    type User{
        id:Int!
        username:String!
        email: String!
        teams:[Team!]!

    }


    type Query {
        allUsers:[User!]!
        me: User!
        getUser(userId:Int!):User

    }
    type RegisterResponse {
        ok: Boolean!
        user: User
        errors: [Error!]
    }
    type LoginResponse{
        ok: Boolean!
        token: String
        refreshToken: String
        errors: [Error!]
    }

    type Mutation {
        register(username:String!,email:String!,password:String!):RegisterResponse!
        login(email:String!,password:String!):LoginResponse!

    }


`;