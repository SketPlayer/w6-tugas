import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();
const STATIC_TOKEN = 'Zx7sBqV1kJ6mH4nT-MncqW35TFWdzx'; // Define static token

export default defineEventHandler(async (event) => {
  // Check for the authorization header
  const token = event.node.req.headers['authorization'];

  // Validate the token
  if (token !== `Bearer ${STATIC_TOKEN}`) {
    return { error: 'Unauthorized' };
  }

  const body = await readBody(event);
  const { name, email, comment } = body;

  if (!name || !email || !comment) {
    return { error: 'All fields are required.' };
  }

  const newEntry = await prisma.guestbookEntry.create({
    data: {
      name,
      email,
      comment,
    },
  });

  return newEntry;
});
