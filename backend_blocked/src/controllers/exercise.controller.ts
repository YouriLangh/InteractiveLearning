import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

<<<<<<< HEAD
export const createExercise = async (req: Request, res: Response) => {
  try {
    const { title, description, difficulty, chapterId } = req.body;
    const createdBy = req.user.id;

=======
// Create Exercise
export const createExercise = async (req: Request, res: Response) => {
  try {
    const { title, description, difficulty, chapterId, visibleTo, stars, order } = req.body;
    const createdBy = req.user.id;

    if (!title || !description || !difficulty || !chapterId || !visibleTo) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

>>>>>>> Fahim2
    const exercise = await prisma.exercise.create({
      data: {
        title,
        description,
        difficulty,
        chapterId,
<<<<<<< HEAD
        createdBy
      }
=======
        createdBy,
        visibleTo,
        order: order ?? 0,
        stars: stars ?? 0,
      },
>>>>>>> Fahim2
    });

    res.status(201).json(exercise);
  } catch (error) {
<<<<<<< HEAD
=======
    console.error("Error creating exercise:", error);
>>>>>>> Fahim2
    res.status(500).json({ message: 'Error creating exercise' });
  }
};

<<<<<<< HEAD
export const updateExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, difficulty } = req.body;
=======
// Update Exercise
export const updateExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, difficulty, visibleTo, stars, order } = req.body;
>>>>>>> Fahim2

    const exercise = await prisma.exercise.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
<<<<<<< HEAD
        difficulty
      }
=======
        difficulty,
        visibleTo,
        stars,
        order,
      },
>>>>>>> Fahim2
    });

    res.json(exercise);
  } catch (error) {
<<<<<<< HEAD
=======
    console.error("Error updating exercise:", error);
>>>>>>> Fahim2
    res.status(500).json({ message: 'Error updating exercise' });
  }
};

<<<<<<< HEAD
=======
// Delete Exercise
>>>>>>> Fahim2
export const deleteExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.exercise.delete({
<<<<<<< HEAD
      where: { id: parseInt(id) }
=======
      where: { id: parseInt(id) },
>>>>>>> Fahim2
    });

    res.status(204).send();
  } catch (error) {
<<<<<<< HEAD
=======
    console.error("Error deleting exercise:", error);
>>>>>>> Fahim2
    res.status(500).json({ message: 'Error deleting exercise' });
  }
};

<<<<<<< HEAD
=======
// Get Exercise by ID
>>>>>>> Fahim2
export const getExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const exercise = await prisma.exercise.findUnique({
<<<<<<< HEAD
      where: { id: parseInt(id) }
=======
      where: { id: parseInt(id) },
>>>>>>> Fahim2
    });

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.json(exercise);
  } catch (error) {
<<<<<<< HEAD
=======
    console.error("Error fetching exercise:", error);
>>>>>>> Fahim2
    res.status(500).json({ message: 'Error fetching exercise' });
  }
};

<<<<<<< HEAD
=======
// Get Exercises by Chapter
>>>>>>> Fahim2
export const getExercisesByChapter = async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.params;

    const exercises = await prisma.exercise.findMany({
      where: { chapterId: parseInt(chapterId) },
<<<<<<< HEAD
      orderBy: { order: 'asc' } as any
=======
      orderBy: { order: 'asc' },
>>>>>>> Fahim2
    });

    res.json(exercises);
  } catch (error) {
<<<<<<< HEAD
=======
    console.error("Error fetching exercises:", error);
>>>>>>> Fahim2
    res.status(500).json({ message: 'Error fetching exercises' });
  }
};

<<<<<<< HEAD
=======
// Update Exercise Order
>>>>>>> Fahim2
export const updateExerciseOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { order } = req.body;

    const exercise = await prisma.exercise.update({
      where: { id: parseInt(id) },
<<<<<<< HEAD
      data: { order } as any
=======
      data: { order },
>>>>>>> Fahim2
    });

    res.json(exercise);
  } catch (error) {
<<<<<<< HEAD
=======
    console.error("Error updating exercise order:", error);
>>>>>>> Fahim2
    res.status(500).json({ message: 'Error updating exercise order' });
  }
};

<<<<<<< HEAD
=======
// Update Exercise Visibility
>>>>>>> Fahim2
export const updateExerciseVisibility = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { visibleTo } = req.body;

    const exercise = await prisma.exercise.update({
      where: { id: parseInt(id) },
<<<<<<< HEAD
      data: { visibleTo } as any
=======
      data: { visibleTo },
>>>>>>> Fahim2
    });

    res.json(exercise);
  } catch (error) {
<<<<<<< HEAD
=======
    console.error("Error updating exercise visibility:", error);
>>>>>>> Fahim2
    res.status(500).json({ message: 'Error updating exercise visibility' });
  }
};

<<<<<<< HEAD
=======
// Update Exercise Stars
>>>>>>> Fahim2
export const updateExerciseStars = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stars } = req.body;

    const exercise = await prisma.exercise.update({
      where: { id: parseInt(id) },
<<<<<<< HEAD
      data: { stars } as any
=======
      data: { stars },
>>>>>>> Fahim2
    });

    res.json(exercise);
  } catch (error) {
<<<<<<< HEAD
    res.status(500).json({ message: 'Error updating exercise stars' });
  }
}; 
=======
    console.error("Error updating exercise stars:", error);
    res.status(500).json({ message: 'Error updating exercise stars' });
  }
};
>>>>>>> Fahim2
