import { GraphQLObjectType, GraphQLBoolean, GraphQLInt, GraphQLString } from 'graphql';
import { MemberType, PrismaClient, Profile } from '@prisma/client';
import { UUIDType } from './uuid.js';
import { memberType } from './member.js';
import { MemberTypeId } from '../../member-types/schemas.js';

export interface IProfile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  // memberType: MemberTypeId;
}

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
    memberType: {
      type: memberType,
      async resolve(parent: Profile, args, context: { prisma: PrismaClient }) {
        const { prisma } = context;
        const memberType = await prisma.memberType.findUnique({
          where: {
            id: parent.memberTypeId,
          },
        });
        return memberType;
      },
    },
  }),
});
