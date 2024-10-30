import { GraphQLObjectType, GraphQLFloat, GraphQLInt, GraphQLEnumType } from "graphql"

export const memberType = new GraphQLObjectType({
	name: 'MemberType',
	fields: () => ({
    id: { type: MemberTypeIdType },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt }

  })
})

const MemberTypeIdType = new GraphQLEnumType({
    name: 'MemberTypeId',
    values: {
      basic: {
          value: 'basic',
      },
      business: {
          value: 'business',
      }
    }
  })