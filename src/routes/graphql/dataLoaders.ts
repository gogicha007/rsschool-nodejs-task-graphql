import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { IUser } from './types/user.js';
import { IPost } from './types/post.js';
import { IProfile } from './types/profile.js';
import { MemberType } from '@prisma/client';
import { MemberTypeId } from '../member-types/schemas.js';

type Loaders = {
  userById: DataLoader<string, IUser>;
  postsByUserId: DataLoader<string, IPost[]>;
  profileByUserId: DataLoader<string, IProfile>;
  profilesByMemberTypeId: DataLoader<string, IProfile[]>;
  memberTypeById: DataLoader<string, MemberType>;
};

export const createDataLoaders = (prisma: PrismaClient): Loaders => {
  const getUserById = async (ids: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: { id: { in: ids as string[] } },
      include: {
        userSubscribedTo: true,
        subscribedToUser: true,
      },
    });

    const userMap = users.reduce(
      (acc, user) => {
        acc[user.id] = user;
        return acc;
      },
      {} as Record<string, IUser>,
    );

    return ids.map((id) => userMap[id]);
  };

  const getPostsByUserID = async (ids: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: ids as string[] } },
    });
    const postMap = posts.reduce(
      (acc, post) => {
        acc[post.authorId]
          ? acc[post.authorId].push(post)
          : (acc[post.authorId] = [post]);
        return acc;
      },
      {} as Record<string, IPost[]>,
    );

    return ids.map((id) => postMap[id]);
  };

  const getProfileByUserID = async (ids: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: ids as string[] } },
    });

    const profileMap = profiles.reduce(
      (acc, profile) => {
        acc[profile.userId] = profile;
        return acc;
      },
      {} as Record<string, IProfile>,
    );

    return ids.map((id) => profileMap[id]);
  };

  const getProfilesByMemberID = async (ids: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: { memberTypeId: { in: ids as MemberTypeId[] } },
    });

    const profileMap = profiles.reduce(
      (acc, profile) => {
        acc[profile.memberTypeId]
          ? acc[profile.memberTypeId].push(profile)
          : (acc[profile.memberTypeId] = [profile]);
        return acc;
      },
      {} as Record<string, IProfile[]>,
    );

    return ids.map((id) => profileMap[id]);
  };

  const getMemberType = async (ids: readonly string[]) => {
    const memberTypes = await prisma.memberType.findMany({
        where: { id: { in: ids as MemberTypeId[] }}
      });
  
      const memberTypeMap = memberTypes.reduce((acc, memberType) => {
        acc[memberType.id] = memberType;
        return acc;
      }, {} as Record<MemberTypeId, MemberType>);
  
      return ids.map(id => memberTypeMap[id]);
  };

  return {
    userById: new DataLoader(getUserById),
    postsByUserId: new DataLoader(getPostsByUserID),
    profileByUserId: new DataLoader(getProfileByUserID),
    profilesByMemberTypeId: new DataLoader(getProfilesByMemberID),
    memberTypeById: new DataLoader(getMemberType),
  };
};
