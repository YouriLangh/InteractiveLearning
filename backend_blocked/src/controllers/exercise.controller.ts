import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createExercise = async (req: Request, res: Response) => {
  try {
    const { title, description, difficulty, chapterId, visibleTo, stars, order } = req.body;
    const createdBy = req.user.id;

    if (!title || !description || !difficulty || !chapterId || !visibleTo) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const exercise = await prisma.exercise.create({
      data: {
        title,
        description,
        difficulty,
        chapterId,
        createdBy,
        visibleTo,
        order: order ?? 0,
        stars: stars ?? 0,
      },
    });

    res.status(201).json(exercise);
  } catch (error) {
    console.error("Error creating exercise:", error);
    res.status(500).json({ message: 'Error creating exercise' });
  }
};

export const updateExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, difficulty, visibleTo, stars, order } = req.body;

    if (!title && !description && !difficulty && !visibleTo && stars === undefined && order === undefined) {
      return res.status(400).json({ message: 'At least one field must be provided for update' });
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (difficulty) updateData.difficulty = difficulty;
    if (visibleTo) updateData.visibleTo = visibleTo;
    if (stars !== undefined) updateData.stars = stars;
    if (order !== undefined) updateData.order = order;

    const exercise = await prisma.exercise.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json(exercise);
  } catch (error) {
    console.error("Error updating exercise:", error);
    res.status(500).json({ message: 'Error updating exercise' });
  }
};

export const deleteExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.exercise.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting exercise:", error);
    res.status(500).json({ message: 'Error deleting exercise' });
  }
};

export const getExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(id) },
    });

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.json(exercise);
  } catch (error) {
    console.error("Error fetching exercise:", error);
    res.status(500).json({ message: 'Error fetching exercise' });
  }
};

export const getExercisesByChapter = async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.params;

    const exercises = await prisma.exercise.findMany({
      where: { chapterId: parseInt(chapterId) },
      orderBy: { order: 'asc' },
    });

    res.json(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ message: 'Error fetching exercises' });
  }
};

export const updateExerciseOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { order } = req.body;

    if (typeof order !== 'number') {
      return res.status(400).json({ message: 'Order must be a number' });
    }

    const exercise = await prisma.exercise.update({
      where: { id: parseInt(id) },
      data: { order },
    });

    res.json(exercise);
  } catch (error) {
    console.error("Error updating exercise order:", error);
    res.status(500).json({ message: 'Error updating exercise order' });
  }
};

export const updateExerciseVisibility = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { visibleTo } = req.body;

    if (!visibleTo || !['ALL', 'TEACHERS_ONLY'].includes(visibleTo)) {
      return res.status(400).json({ message: 'Invalid visibility value' });
    }

    const exercise = await prisma.exercise.update({
      where: { id: parseInt(id) },
      data: { visibleTo },
    });

    res.json(exercise);
  } catch (error) {
    console.error("Error updating exercise visibility:", error);
    res.status(500).json({ message: 'Error updating exercise visibility' });
  }
};

export const updateExerciseStars = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stars } = req.body;

    if (typeof stars !== 'number' || stars < 0 || stars > 5) {
      return res.status(400).json({ message: 'Stars must be a number between 0 and 5' });
    }

    const exercise = await prisma.exercise.update({
      where: { id: parseInt(id) },
      data: { stars },
    });

    res.json(exercise);
  } catch (error) {
    console.error("Error updating exercise stars:", error);
    res.status(500).json({ message: 'Error updating exercise stars' });
  }
}; 