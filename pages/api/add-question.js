import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { company, topic, question } = req.body;
      if (!company || !topic || !question) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      const newQuestion = await prisma.question.create({
        data: {
          company,
          topic,
          question,
        },
      });

      return res.status(200).json({ message: 'Question added successfully', newQuestion });
    } catch (error) {
      console.error('Error in add-question API:', error);
      return res.status(500).json({ message: 'An error occurred while adding the question' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
