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
    const result = await prisma.$queryRawUnsafe(
      `SELECT * FROM GuestbookEntry WHERE comment LIKE '%${search}%'`
    );

    return result;
  } catch (e) {
    console.error('Error executing SQL query:', e);
    return { error: 'Error executing SQL query' };
  }
});

