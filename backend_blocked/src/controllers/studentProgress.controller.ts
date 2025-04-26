import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStudentProgress = async (req: Request, res: Response) => {
  try {
    const { studentId, chapterId } = req.params;

    // Only allow students to view their own progress or teachers to view any student's progress
    if (req.user.role !== 'TEACHER' && req.user.id !== parseInt(studentId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const progress = await prisma.studentProgress.findFirst({
      where: {
        studentId: parseInt(studentId),
        chapterId: parseInt(chapterId)
      }
    });

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student progress' });
  }
};

export const updateStudentProgress = async (req: Request, res: Response) => {
  try {
    const { studentId, chapterId } = req.params;
    const { completedExercises, successRate } = req.body;

    // Only allow students to update their own progress
    if (req.user.id !== parseInt(studentId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const progress = await prisma.studentProgress.upsert({
      where: {
        studentId_chapterId: {
          studentId: parseInt(studentId),
          chapterId: parseInt(chapterId)
        } as any
      } as any,
      update: {
        completedExercises,
        successRate,
        lastUpdated: new Date()
      } as any,
      create: {
        studentId: parseInt(studentId),
        chapterId: parseInt(chapterId),
        completedExercises,
        successRate
      }
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error updating student progress' });
  }
}; 