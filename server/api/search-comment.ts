import { PrismaClient } from '@prisma/client';
import { defineEventHandler, getQuery } from 'h3';

const prisma = new PrismaClient();
const STATIC_TOKEN = 'Vcb6lm6LkMow49uX-Pk731nAnOvbS3'; // Define static token

export default defineEventHandler(async (event) => {
  // Check for the authorization header
  const token = event.node.req.headers['authorization'];

  // Validate the token
  if (token !== `Bearer ${STATIC_TOKEN}`) {
    return { error: 'Unauthorized' };
  }
  
  const query = getQuery(event);
  const { search } = query;

  if (!search) {
    return { error: 'Search term is required.' };
  }

  try {
    // Using Prisma's query builder to avoid SQL Injection
    const result = await prisma.guestbookEntry.findMany({
      where: {
        comment: {
          contains: search,  // Searching for comments that contain the search term
        },
      },
    });

    return result;
  } catch (e) {
    console.error('Error executing query:', e);
    return { error: 'Error executing query' };
  }
});
