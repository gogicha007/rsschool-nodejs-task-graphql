import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString} from 'graphql';
import { PrismaClient, User } from '@prisma/client';
import { UUIDType } from './uuid.js';
import { ProfileType, IProfile } from './profile.js';
import { IPost, PostType } from './post.js'; 

interface ISubscription {
  subscriberId: string;
  authorId: string;
};
export interface IUser {
  id: string;
  name: string;
  balance: number;
  userSubscribedTo?: ISubscription[];
  subscribedToUser?: ISubscription[];
}

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType,
      async resolve(parent: User, args, context: { prisma: PrismaClient }) {
        const { prisma } = context;
        const profile = await prisma.profile.findUnique({
          where: {
            userId: parent.id,
          },
        });
        return profile;
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      async resolve(parent: User, args, context: { prisma: PrismaClient }) {
        const { prisma } = context;
        const posts = await prisma.post.findMany({
          where: {
            authorId: parent.id,
          },
        });
        return posts;
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      async resolve(parent: User, args, context: { prisma: PrismaClient }) {
        const { prisma } = context;
        const subscribers = await prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: parent.id,
              },
            },
          },
        });
        return subscribers;
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      async resolve(parent: User, args, context: { prisma: PrismaClient }) {
        const { prisma } = context;
        const subscribedTo = await prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: parent.id,
              },
            },
          },
        });
        return subscribedTo;
      },
    },
  }),
});
