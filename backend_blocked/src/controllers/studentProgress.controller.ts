import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to calculate overall success rate
const calculateOverallSuccessRate = async (studentId: number) => {
  // Get all exercises
  const exercises = await prisma.exercise.findMany({
    select: { id: true }
  });

  const totalExercises = exercises.length;
  if (totalExercises === 0) return 0;

  // Get all attempts for these exercises by this student
  const attempts = await prisma.exerciseAttempt.findMany({
    where: {
      exerciseId: { in: exercises.map(e => e.id) },
      studentId
    }
  });

  // Count successful attempts (PASSED status)
  const successfulAttempts = attempts.filter(attempt => attempt.status === 'PASSED').length;
  
  // Calculate success rate as percentage
  return (successfulAttempts / totalExercises) * 100;
};

export const getStudentProgress = async (req: Request, res: Response) => {
  try {
    const { studentId, chapterId } = req.params;

    if (!studentId || !chapterId || isNaN(parseInt(studentId)) || isNaN(parseInt(chapterId))) {
      return res.status(400).json({ message: 'Invalid student ID or chapter ID' });
    }

    if (req.user.role !== 'TEACHER' && req.user.id !== parseInt(studentId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Verify chapter exists
    const chapter = await prisma.chapter.findUnique({
      where: { id: parseInt(chapterId) }
    });

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
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
    console.error('Error fetching student progress:', error);
    res.status(500).json({ message: 'Error fetching student progress' });
  }
};

export const getStudentFullProgress = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    if (!studentId || isNaN(parseInt(studentId))) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

    if (req.user.role !== 'TEACHER' && req.user.id !== parseInt(studentId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Verify student exists
    const student = await prisma.user.findUnique({
      where: { id: parseInt(studentId) }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const chapters = await prisma.chapter.findMany({
      orderBy: { order: 'asc' },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
          include: {
            attempts: {
              where: {
                studentId: parseInt(studentId)
              },
              orderBy: { createdAt: 'asc' }
            }
          }
        }
      }
    });

    const formattedChapters = chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      exercises: chapter.exercises.map((exercise) => ({
        id: exercise.id,
        title: exercise.title,
        timeTaken: "N/A",
        hintsUsed: exercise.attempts.reduce((sum, attempt) => sum + (attempt.hintUsedCount || 0), 0),
        attempts: exercise.attempts.map((attempt) => attempt.status === "PASSED")
      }))
    }));

    res.status(200).json({
      studentId: parseInt(studentId),
      chapters: formattedChapters
    });

  } catch (error) {
    console.error('Error fetching student full progress:', error);
    res.status(500).json({ message: 'Error fetching student progress' });
  }
};

export const updateStudentProgress = async (req: Request, res: Response) => {
  try {
    const { studentId, chapterId } = req.params;
    const { completedExercises, successRate } = req.body;

    if (!studentId || !chapterId || isNaN(parseInt(studentId)) || isNaN(parseInt(chapterId))) {
      return res.status(400).json({ message: 'Invalid student ID or chapter ID' });
    }

    if (typeof completedExercises !== 'number' || typeof successRate !== 'number') {
      return res.status(400).json({ message: 'completedExercises and successRate must be numbers' });
    }

    if (successRate < 0 || successRate > 100) {
      return res.status(400).json({ message: 'successRate must be between 0 and 100' });
    }

    if (req.user.id !== parseInt(studentId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Verify chapter exists
    const chapter = await prisma.chapter.findUnique({
      where: { id: parseInt(chapterId) }
    });

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    const existingProgress = await prisma.studentProgress.findFirst({
      where: {
        studentId: parseInt(studentId),
        chapterId: parseInt(chapterId)
      }
    });

    const progress = existingProgress 
      ? await prisma.studentProgress.update({
          where: { id: existingProgress.id },
          data: {
            completedExercises,
            successRate,
            lastUpdated: new Date()
          }
        })
      : await prisma.studentProgress.create({
          data: {
            studentId: parseInt(studentId),
            chapterId: parseInt(chapterId),
            completedExercises,
            successRate
          }
        });

    res.json(progress);
  } catch (error) {
    console.error('Error updating student progress:', error);
    res.status(500).json({ message: 'Error updating student progress' });
  }
};

export const getStudentSuccessRate = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    if (!studentId || isNaN(parseInt(studentId))) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

    // Check if user has permission to view this data
    if (req.user.role !== 'TEACHER' && req.user.id !== parseInt(studentId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Calculate overall success rate
    const successRate = await calculateOverallSuccessRate(parseInt(studentId));

    // Get total exercises and solved exercises for more detailed stats
    const totalExercises = await prisma.exercise.count();
    const solvedExercises = await prisma.exerciseAttempt.count({
      where: {
        studentId: parseInt(studentId),
        status: 'PASSED'
      }
    });

    res.json({
      studentId: parseInt(studentId),
      successRate,
      totalExercises,
      solvedExercises
    });
  } catch (error) {
    console.error('Error calculating student success rate:', error);
    res.status(500).json({ message: 'Error calculating success rate' });
  }
};

// Update the submitStudentAnswer function to recalculate success rate
export const updateSuccessRateAfterAttempt = async (studentId: number) => {
  try {
    const successRate = await calculateOverallSuccessRate(studentId);
    
    // Update all student progress records with the new overall success rate
    const chapters = await prisma.chapter.findMany();
    
    for (const chapter of chapters) {
      await prisma.studentProgress.upsert({
        where: {
          id: (await prisma.studentProgress.findFirst({
            where: {
              studentId,
              chapterId: chapter.id
            }
          }))?.id || -1
        },
        update: {
          successRate,
          lastUpdated: new Date()
        },
        create: {
          studentId,
          chapterId: chapter.id,
          successRate,
          completedExercises: 0
        }
      });
    }
  } catch (error) {
    console.error('Error updating success rate:', error);
  }
}; 