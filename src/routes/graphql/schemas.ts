import { Type } from '@fastify/type-provider-typebox';
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLSchema,
} from 'graphql';
import { PrismaClient } from '@prisma/client';
import { memberType, MemberTypeIdType } from './types/member.js';
import { PostType } from './types/post.js';
import { UUIDType } from './types/uuid.js';
import { UserType } from './types/user.js';
import { ProfileType } from './types/profile.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberType: {
      type: memberType,
      args: { id: { type: MemberTypeIdType } },
      async resolve(parent, args: { id: string }, context: { prisma: PrismaClient }) {
        const { prisma } = context;
        const memberType = await prisma.memberType.findUnique({
          where: {
            id: args.id,
          },
        });
        return memberType;
      },
    },
    memberTypes: {
      type: new GraphQLList(memberType),
      async resolve(parent, args, context: { prisma: PrismaClient }) {
        const { prisma } = context;
        const mTypes = await prisma.memberType.findMany();
        return mTypes;
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      async resolve(parent, args, context: { prisma: PrismaClient }) {
        const { prisma } = context;
        const posts = await prisma.post.findMany();
        return posts.length > 0 ? posts : null;
      },
    },
    post: {
      type: PostType,
      args: { id: { type: UUIDType } },
      async resolve(parent, args: { id: string }, context: { prisma: PrismaClient }) {
        const { prisma } = context;
        const post = await prisma.post.findUnique({
          where: {
            id: args.id,
          },
        });
        return post;
      },
    },
    users: {
      type: new GraphQLList(UserType),
      async resolve(parent, args, context: { prisma: PrismaClient }) {
        const { prisma } = context;
        const users = await prisma.user.findMany();
        return users;
      },
    },
    user: {
      type: UserType,
      args: { id: { type: UUIDType } },
      async resolve(parent, args: { id: string }, context: { prisma: PrismaClient }) {
        const { prisma } = context;
        const user = await prisma.user.findUnique({
          where: {
            id: args.id,
          },
        });
        return user;
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      async resolve(parent, args, context: { prisma: PrismaClient }) {
        const { prisma } = context;
        const profiles = await prisma.profile.findMany();
        return profiles;
      },
    },
    profile: {
      type: ProfileType,
      args: { id: { type: UUIDType } },
      async resolve(parent, args: { id: string }, context: { prisma: PrismaClient }) {
        const { prisma } = context;
        const profile = await prisma.profile.findUnique({
          where: {
            id: args.id,
          },
        });
        return profile;
      },
    },
  },
});

const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    memberTypeId: { type: MemberTypeIdType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
  },
});

const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    authorId: { type: new GraphQLNonNull(UUIDType) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const ChangePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    authorId: { type: UUIDType },
    content: { type: GraphQLString },
    title: { type: GraphQLString },
  },
});

const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createUser: {
      type: UserType,
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInputType) },
      },
      async resolve(
        parent,
        args: { dto: { name: string; balance: number } },
        context: { prisma: PrismaClient },
      ) {
        const { prisma } = context;
        const result = await prisma.user.create({
          data: args.dto,
        });
        return result;
      },
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInputType) },
      },
      async resolve(
        parent,
        args: { id: string; dto: { name: string; balance: number } },
        context: { prisma: PrismaClient },
      ) {
        const { prisma } = context;
        const result = await prisma.user.update({
          where: { id: args.id },
          data: args.dto,
        });
        return result;
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(parent, args: { id: string }, context: { prisma: PrismaClient }) {
        const { prisma } = context;
        await prisma.user.delete({
          where: {
            id: args.id,
          },
        });
        return true;
      },
    },
    createProfile: {
      type: ProfileType,
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInputType) },
      },
      async resolve(
        parent,
        args: {
          dto: {
            userId: string;
            memberTypeId: string;
            isMale: boolean;
            yearOfBirth: number;
          };
        },
        context: { prisma: PrismaClient },
      ) {
        const { prisma } = context;
        const result = await prisma.profile.create({
          data: args.dto,
        });
        return result;
      },
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInputType) },
      },
      async resolve(
        parent,
        args: {
          id: string;
          dto: {
            userId: string;
            memberTypeId: string;
            isMale: boolean;
            yearOfBirth: number;
          };
        },
        context: { prisma: PrismaClient },
      ) {
        const { prisma } = context;
        const result = await prisma.profile.update({
          where: { id: args.id },
          data: args.dto,
        });
        return result;
      },
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(parent, args: { id: string }, context: { prisma: PrismaClient }) {
        const { prisma } = context;
        await prisma.profile.delete({
          where: {
            id: args.id,
          },
        });
        return true;
      },
    },
    createPost: {
      type: PostType,
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInputType) },
      },
      async resolve(
        parent,
        args: { dto: { authorId: string; content: string; title: string } },
        context: { prisma: PrismaClient },
      ) {
        const { prisma } = context;
        const result = await prisma.post.create({
          data: args.dto,
        });
        return result;
      },
    },
    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInputType) },
      },
      async resolve(
        parent,
        args: { id: string; dto: { authorId: string; content: string; title: string } },
        context: { prisma: PrismaClient },
      ) {
        const { prisma } = context;
        const result = await prisma.post.update({
          where: { id: args.id },
          data: args.dto,
        });
        return result;
      },
    },
    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(parent, args: { id: string }, context: { prisma: PrismaClient }) {
        const { prisma } = context;
        await prisma.post.delete({
          where: {
            id: args.id,
          },
        });
        return true;
      },
    },
    subscribeTo: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(
        parent,
        args: { userId: string; authorId: string },
        context: { prisma: PrismaClient },
      ) {
        try {
          console.log(args.userId)
          const { prisma } = context;
          const result = await prisma.user.update({
            where: {
              id: args.userId,
            },
            data: {
              userSubscribedTo: {
                create: {
                  authorId: args.authorId,
                },
              },
            },
          });
          return result;
        } catch {
          return null;
        }
      },
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(
        parent,
        args: { userId: string; authorId: string },
        context: { prisma: PrismaClient },
      ) {
        const { prisma } = context;
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: args.userId,
              authorId: args.authorId,
            },
          },
        });
        return true;
      },
    },
  },
});

export const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations,
});
