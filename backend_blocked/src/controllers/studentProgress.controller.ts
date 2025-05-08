import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

<<<<<<< HEAD
=======
// ✅ FOR STUDENT → Get progress of single chapter
>>>>>>> Fahim2
export const getStudentProgress = async (req: Request, res: Response) => {
  try {
    const { studentId, chapterId } = req.params;

<<<<<<< HEAD
    // Only allow students to view their own progress or teachers to view any student's progress
=======
>>>>>>> Fahim2
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

<<<<<<< HEAD
=======
// ✅ FOR TEACHER → Get full progress (all chapters + exercises + attempts)
export const getStudentFullProgress = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    if (req.user.role !== 'TEACHER' && req.user.id !== parseInt(studentId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const chapters = await prisma.chapter.findMany({
      orderBy: { order: 'asc' } as any,
      include: {
        exercises: {
          orderBy: { order: 'asc' } as any,
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
        hintsUsed: 0,
        attempts: (exercise.attempts ?? []).map((a) => a.status === "CORRECT")
      }))
    }));

    res.status(200).json({
      studentId: parseInt(studentId),
      chapters: formattedChapters
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching student progress' });
  }
};

// ✅ FOR STUDENT → Update progress
>>>>>>> Fahim2
export const updateStudentProgress = async (req: Request, res: Response) => {
  try {
    const { studentId, chapterId } = req.params;
    const { completedExercises, successRate } = req.body;

<<<<<<< HEAD
    // Only allow students to update their own progress
=======
>>>>>>> Fahim2
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
<<<<<<< HEAD
}; 
=======
};
>>>>>>> Fahim2
