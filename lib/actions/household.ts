'use server';

import { v4 } from 'uuid';
import prisma from '@/lib/prisma';

// Generate a unique, readable 6-character household code prefixed with HH-
function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'HH-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createHousehold(userUid: string, mergeExistingData: boolean) {
  try {
    const user = await prisma.user.findUnique({
      where: { uid: userUid }
    });

    if (!user) {
      return { error: 'User not found.' };
    }

    // Generate unique code ensuring no collisions
    let code = '';
    let existing = null;
    let attempts = 0;
    do {
      code = generateCode();
      existing = await prisma.household.findUnique({ where: { code } });
      attempts++;
    } while (existing && attempts < 10);

    if (existing) {
      return { error: 'Failed to generate a unique household code. Please try again.' };
    }

    const household = await prisma.household.create({
      data: {
        id: v4(),
        code,
        name: `${user.name || 'My'}'s Household`,
        createdAt: new Date()
      }
    });

    // Update user to link to this household and default sharing to true
    await prisma.user.update({
      where: { uid: userUid },
      data: {
        householdId: household.id,
        shareDecisionHelper: true,
        shareBucketList: true
      }
    });

    // Handle data merge if requested
    if (mergeExistingData) {
      // Merge Decision Helper lists
      await prisma.decisionHelperList.updateMany({
        where: {
          uid: userUid,
          householdId: null
        },
        data: {
          householdId: household.id
        }
      });

      // Merge Bucket List items
      await prisma.bucketListItem.updateMany({
        where: {
          uid: userUid,
          householdId: null
        },
        data: {
          householdId: household.id
        }
      });
    }

    return { success: true, household };
  } catch (error) {
    console.error('Error creating household:', error);
    return { error: 'An unexpected error occurred while creating the household.' };
  }
}

export async function joinHousehold(userUid: string, code: string, mergeExistingData: boolean) {
  try {
    const user = await prisma.user.findUnique({
      where: { uid: userUid }
    });

    if (!user) {
      return { error: 'User not found.' };
    }

    const cleanCode = code.trim().toUpperCase();
    const household = await prisma.household.findUnique({
      where: { code: cleanCode }
    });

    if (!household) {
      return { error: 'Household code is invalid or does not exist.' };
    }

    // Update user to link to the household
    await prisma.user.update({
      where: { uid: userUid },
      data: {
        householdId: household.id,
        shareDecisionHelper: true,
        shareBucketList: true
      }
    });

    // Handle data merge if requested
    if (mergeExistingData) {
      // Merge Decision Helper lists
      await prisma.decisionHelperList.updateMany({
        where: {
          uid: userUid,
          householdId: null
        },
        data: {
          householdId: household.id
        }
      });

      // Merge Bucket List items
      await prisma.bucketListItem.updateMany({
        where: {
          uid: userUid,
          householdId: null
        },
        data: {
          householdId: household.id
        }
      });
    }

    return { success: true, household };
  } catch (error) {
    console.error('Error joining household:', error);
    return { error: 'An unexpected error occurred while joining the household.' };
  }
}

export async function leaveHousehold(userUid: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { uid: userUid }
    });

    if (!user) {
      return { error: 'User not found.' };
    }

    // Disconnect user from the household
    await prisma.user.update({
      where: { uid: userUid },
      data: {
        householdId: null,
        // Reset sharing settings to true so if they join a new household, it defaults to true
        shareDecisionHelper: true,
        shareBucketList: true
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error leaving household:', error);
    return { error: 'An unexpected error occurred while leaving the household.' };
  }
}

export async function toggleFeatureSharing(
  userUid: string,
  feature: 'decisionHelper' | 'bucketList',
  enabled: boolean
) {
  try {
    const dataField = feature === 'decisionHelper' ? 'shareDecisionHelper' : 'shareBucketList';
    const updatedUser = await prisma.user.update({
      where: { uid: userUid },
      data: {
        [dataField]: enabled
      }
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Error toggling feature sharing:', error);
    return { error: 'Failed to update sharing settings.' };
  }
}

export async function getHouseholdDetails(userUid: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { uid: userUid },
      include: {
        household: {
          include: {
            users: {
              select: {
                id: true,
                uid: true,
                name: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return null;
    }

    if (!user.household) {
      return {
        inHousehold: false,
        userSettings: {
          shareDecisionHelper: user.shareDecisionHelper,
          shareBucketList: user.shareBucketList
        }
      };
    }

    return {
      inHousehold: true,
      household: {
        id: user.household.id,
        code: user.household.code,
        name: user.household.name,
        members: user.household.users
      },
      userSettings: {
        shareDecisionHelper: user.shareDecisionHelper,
        shareBucketList: user.shareBucketList
      }
    };
  } catch (error) {
    console.error('Error retrieving household details:', error);
    return null;
  }
}
