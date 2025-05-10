import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { updateSuccessRateAfterAttempt } from './studentProgress.controller';

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

    if (!exerciseId) {
      return res.status(400).json({ message: 'Exercise ID is required' });
    }

    // Verify exercise exists
    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(exerciseId) }
    });

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    const attempt = await prisma.exerciseAttempt.create({
      data: {
        exerciseId: parseInt(exerciseId),
        studentId,
        status: 'FAILED',
        attemptsCount: 0,
        hintUsedCount: 0,
        studentAnswer: null
      }
    });

    res.status(201).json(attempt);
  } catch (error) {
    console.error('Error creating attempt:', error);
    res.status(500).json({ message: 'Error creating attempt' });
  }
};

export const getAttempt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid attempt ID' });
    }

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
    console.error('Error fetching attempt:', error);
    res.status(500).json({ message: 'Error fetching attempt' });
  }
};

export const getAttemptsByExercise = async (req: Request, res: Response) => {
  try {
    const { exerciseId } = req.params;

    if (!exerciseId || isNaN(parseInt(exerciseId))) {
      return res.status(400).json({ message: 'Invalid exercise ID' });
    }

    // Verify exercise exists
    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(exerciseId) }
    });

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

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
    console.error('Error fetching attempts:', error);
    res.status(500).json({ message: 'Error fetching attempts' });
  }
};

export const getAttemptsByStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    if (!studentId || isNaN(parseInt(studentId))) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

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
    console.error('Error fetching attempts:', error);
    res.status(500).json({ message: 'Error fetching attempts' });
  }
};

export const submitStudentAnswer = async (req: Request<{ id: string }, {}, SubmitAnswerBody>, res: Response) => {
  try {
    const { id } = req.params;
    const { answer, isCorrect } = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid attempt ID' });
    }

    if (!answer) {
      return res.status(400).json({ message: 'Answer is required' });
    }

    // Verify attempt exists and belongs to the student
    const existingAttempt = await prisma.exerciseAttempt.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingAttempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    if (existingAttempt.studentId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const attempt = await prisma.exerciseAttempt.update({
      where: { id: parseInt(id) },
      data: {
        studentAnswer: answer,
        status: isCorrect ? 'PASSED' : 'FAILED',
        attemptsCount: {
          increment: 1
        }
      }
    });

    // Update success rate after attempt
    await updateSuccessRateAfterAttempt(req.user.id);

    res.json(attempt);
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ message: 'Error submitting answer' });
  }
}; 