export default `


type DirectMessage {
    id: Int!
    text:String!
    sender: User!
    receiverId: Int!
    createdAt: String!
}


type Query {
     directMessages(teamId: Int!, otherUserId: Int!): [DirectMessage !]!
}

type Mutation {
    createDirectMessage ( receiverId:Int!,text:String!,teamId:Int!): Boolean!
}

type Subscription {
  newDirectMessage(teamId:Int!,userId: Int!): DirectMessage!
}

`;