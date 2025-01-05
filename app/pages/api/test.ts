import prisma from '@/lib/prisma';
import { Candidate } from '@/models/candidate';
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string,
  users: any[]
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
 
  const users = await prisma.candidate.findMany({
     take: 2, 
  });

  res.status(200).json({ 
    message: 'Hello from Next.js!',
    users: users
  });
}