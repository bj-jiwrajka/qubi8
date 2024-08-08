import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { company = '', topic = '' } = req.query;
      const questions = await prisma.question.findMany({
        where: {
          company: {
            contains: company,
            mode: 'insensitive',
          },
          topic: {
            contains: topic,
            mode: 'insensitive',
          },
        },
      });

      return res.status(200).json(questions);
    } catch (error) {
      console.error('Error in get-questions API:', error);
      return res.status(500).json({ message: 'An error occurred while fetching questions' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
