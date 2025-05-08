import { Request, Response } from 'express';
import { PrismaClient, AttemptStatus } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateAttemptBody {
  exerciseId: string;
}

interface SubmitAnswerBody {
  answer: string;
  isCorrect: boolean;
}

export const createAttempt = async (req: Request<{}, {}, CreateAttemptBody>, res: Response) => {
  try {
    const { exerciseId } = req.body;
    const studentId = req.user.id;

    const attempt = await prisma.exerciseAttempt.create({
      data: {
        exerciseId: parseInt(exerciseId),
        studentId,
        status: AttemptStatus.FAILED,
        attemptsCount: 0,
        hintUsedCount: 0,
        studentAnswer: null
      } as any
    });

    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ message: 'Error creating attempt' });
  }
};

export const getAttempt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const attempt = await prisma.exerciseAttempt.findUnique({
      where: { id: parseInt(id) },
      include: {
        exercise: true
      }
    });

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    // Check if user has access to this attempt
    if (attempt.studentId !== req.user.id && req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attempt' });
  }
};

export const getAttemptsByExercise = async (req: Request, res: Response) => {
  try {
    const { exerciseId } = req.params;

    const attempts = await prisma.exerciseAttempt.findMany({
      where: { 
        exerciseId: parseInt(exerciseId),
        studentId: req.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attempts' });
  }
};

export const getAttemptsByStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    // Only teachers or the student themselves can view their attempts
    if (req.user.id !== parseInt(studentId) && req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const attempts = await prisma.exerciseAttempt.findMany({
      where: { studentId: parseInt(studentId) },
      include: {
        exercise: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attempts' });
  }
};

export const submitStudentAnswer = async (req: Request<{ id: string }, {}, SubmitAnswerBody>, res: Response) => {
  try {
    const { id } = req.params;
    const { answer, isCorrect } = req.body;

    const attempt = await prisma.exerciseAttempt.update({
      where: { id: parseInt(id) },
      data: {
        studentAnswer: answer,
        status: isCorrect ? AttemptStatus.PASSED : AttemptStatus.FAILED,
        attemptsCount: {
          increment: 1
        }
      } as any
    });

    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting answer' });
  }
}; 