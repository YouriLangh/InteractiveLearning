import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createExercise = async (req: Request, res: Response) => {
  try {
    const { title, description, difficulty, chapterId } = req.body;
    const createdBy = req.user.id;

    const exercise = await prisma.exercise.create({
      data: {
        title,
        description,
        difficulty,
        chapterId,
        createdBy
      }
    });

    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ message: 'Error creating exercise' });
  }
};

export const updateExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, difficulty } = req.body;

    const exercise = await prisma.exercise.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        difficulty
      }
    });

    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: 'Error updating exercise' });
  }
};

export const deleteExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.exercise.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exercise' });
  }
};

export const getExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(id) }
    });

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exercise' });
  }
};

export const getExercisesByChapter = async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.params;

    const exercises = await prisma.exercise.findMany({
      where: { chapterId: parseInt(chapterId) },
      orderBy: { order: 'asc' } as any
    });

    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exercises' });
  }
};

export const updateExerciseOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { order } = req.body;

    const exercise = await prisma.exercise.update({
      where: { id: parseInt(id) },
      data: { order } as any
    });

    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: 'Error updating exercise order' });
  }
};

export const updateExerciseVisibility = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { visibleTo } = req.body;

    const exercise = await prisma.exercise.update({
      where: { id: parseInt(id) },
      data: { visibleTo } as any
    });

    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: 'Error updating exercise visibility' });
  }
};

export const updateExerciseStars = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stars } = req.body;

    const exercise = await prisma.exercise.update({
      where: { id: parseInt(id) },
      data: { stars } as any
    });

    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: 'Error updating exercise stars' });
  }
}; 