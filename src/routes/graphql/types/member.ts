import { GraphQLObjectType, GraphQLFloat, GraphQLInt, GraphQLEnumType, GraphQLList } from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';
import { ProfileType } from './profile.js';
import { MemberType } from '@prisma/client';
import { createDataLoaders } from '../dataLoaders.js';

const dataLoaders = createDataLoaders

export const memberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: MemberTypeIdType },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async(parent: MemberType, _, { memberTypeByIdLoader }) => memberTypeByIdLoader.load(parent.id)
    }
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
