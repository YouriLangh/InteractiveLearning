// This file handles everything about exercise attempts
// It helps track when students try exercises and their answers
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
  timeTaken: number;
  isCleanup?: boolean;
}

// Create a new attempt for an exercise
export const createAttempt = async (req: Request<{}, {}, CreateAttemptBody>, res: Response) => {
  try {
    const { exerciseId } = req.body;
    const studentId = req.user.id;

    // Make sure we have an exercise ID
    if (!exerciseId) {
      return res.status(400).json({ message: 'Exercise ID is required' });
    }

    // Check if the exercise exists
    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(exerciseId) }
    });

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    // Create a new attempt
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

// Get details of a specific attempt
export const getAttempt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if the attempt ID is valid
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid attempt ID' });
    }

    // Find the attempt
    const attempt = await prisma.exerciseAttempt.findUnique({
      where: { id: parseInt(id) },
      include: {
        exercise: true
      }
    });

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    // Make sure only the student or their teacher can see this
    if (attempt.studentId !== req.user.id && req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(attempt);
  } catch (error) {
    console.error('Error fetching attempt:', error);
    res.status(500).json({ message: 'Error fetching attempt' });
  }
};

// Get all attempts for a specific exercise
export const getAttemptsByExercise = async (req: Request, res: Response) => {
  try {
    const { exerciseId } = req.params;

    // Check if the exercise ID is valid
    if (!exerciseId || isNaN(parseInt(exerciseId))) {
      return res.status(400).json({ message: 'Invalid exercise ID' });
    }

    // Check if the exercise exists
    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(exerciseId) }
    });

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    // Get all attempts for this exercise by this student
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

// Get all attempts by a specific student
export const getAttemptsByStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    // Check if the student ID is valid
    if (!studentId || isNaN(parseInt(studentId))) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

    // Only teachers or the student themselves can see their attempts
    if (req.user.id !== parseInt(studentId) && req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get all attempts by this student
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

// Submit an answer for an attempt
export const submitStudentAnswer = async (req: Request<{ id: string }, {}, SubmitAnswerBody>, res: Response) => {
  try {
    const { id } = req.params;
    const { answer, isCorrect, timeTaken, isCleanup } = req.body;

    console.log(`[Time Tracking] Received attempt submission for ID: ${id}`);
    console.log(`[Time Tracking] Time taken: ${timeTaken} seconds`);
    if (isCleanup) {
      console.log('[Time Tracking] This is a cleanup save (student left the exercise)');
    }

    // Check if the attempt ID is valid
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid attempt ID' });
    }

    // Make sure we have an answer (unless it's a cleanup)
    if (!answer && !isCleanup) {
      return res.status(400).json({ message: 'Answer is required' });
    }

    // Check if the time taken is valid
    if (typeof timeTaken !== 'number' || timeTaken < 0) {
      console.error(`[Time Tracking] Invalid time value received: ${timeTaken}`);
      return res.status(400).json({ message: 'Invalid time taken value' });
    }

    // Find the attempt and make sure it belongs to this student
    const existingAttempt = await prisma.exerciseAttempt.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingAttempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    if (existingAttempt.studentId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update the attempt with the answer and time
    console.log(`[Time Tracking] Updating attempt ${id} with time: ${timeTaken} seconds`);
    const attempt = await prisma.exerciseAttempt.update({
      where: { id: parseInt(id) },
      data: {
        studentAnswer: answer || existingAttempt.studentAnswer, // Keep existing answer if cleanup
        status: isCleanup ? existingAttempt.status : (isCorrect ? 'PASSED' : 'FAILED'),
        attemptsCount: {
          increment: isCleanup ? 0 : 1 // Don't increment attempts on cleanup
        },
        timeTaken: timeTaken as any // Force type to match Prisma's expectations
      }
    });

    console.log(`[Time Tracking] Successfully saved time for attempt ${id}`);
    console.log(`[Time Tracking] Final time saved to database: ${timeTaken} seconds`);

    // Update the student's success rate (only if not cleanup)
    if (!isCleanup) {
      await updateSuccessRateAfterAttempt(req.user.id);
    }

    res.json(attempt);
  } catch (error) {
    console.error('[Time Tracking] Error submitting answer:', error);
    res.status(500).json({ message: 'Error submitting answer' });
  }
}; 