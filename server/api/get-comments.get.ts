import { PrismaClient } from '@prisma/client';
import { defineEventHandler } from 'h3';

const prisma = new PrismaClient();
const STATIC_TOKEN = '4cD2fG8jR9wQpY3s-SAxSFefgeaDS2'; // Define static token

export default defineEventHandler(async (event) => {
  // Check for the authorization header
  const token = event.node.req.headers['authorization'];

  // Validate the token
  if (token !== `Bearer ${STATIC_TOKEN}`) {
    return { error: 'Unauthorized' };
  }

  try {
    const comments = await prisma.guestbookEntry.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comments;
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return { error: 'Failed to fetch comments' };
  }
});
