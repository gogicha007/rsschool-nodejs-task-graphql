import { GraphQLObjectType, GraphQLString } from "graphql"
import { UUIDType } from "./uuid.js"

export interface IPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

export const PostType = new GraphQLObjectType({
	name: 'Post',
	fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: GraphQLString }
  })
})