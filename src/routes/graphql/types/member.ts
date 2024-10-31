import { GraphQLObjectType, GraphQLFloat, GraphQLInt, GraphQLEnumType } from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';


export const memberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: MemberTypeIdType },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

export const MemberTypeIdType = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberTypeId.BASIC]: {
      value: MemberTypeId.BASIC,
    },
    [MemberTypeId.BUSINESS]: {
      value: MemberTypeId.BUSINESS,
    },
  },
});
