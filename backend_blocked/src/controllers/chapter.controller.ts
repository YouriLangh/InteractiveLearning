import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getChapter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const chapter = await prisma.chapter.findUnique({
      where: { id: parseInt(id) },
      include: {
        exercises: {
          orderBy: { order: 'asc' } as any
        }
      }
    });

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    res.json(chapter);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chapter' });
  }
};

<<<<<<< HEAD
=======
export const getAllChapters = async (req: Request, res: Response) => {
  try {
    const chapters = await prisma.chapter.findMany({
      orderBy: { order: 'asc' } as any,
      include: {
        exercises: {
          orderBy: { order: 'asc' } as any
        }
      }
    });

    res.json(chapters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chapters' });
  }
};



>>>>>>> Fahim2
export const getChaptersByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    const chapters = await prisma.chapter.findMany({
      where: { categoryId: parseInt(categoryId) },
      orderBy: { order: 'asc' } as any,
      include: {
        exercises: {
          orderBy: { order: 'asc' } as any
        }
      }
    });

    res.json(chapters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chapters' });
  }
};

export const createChapter = async (req: Request, res: Response) => {
  try {
<<<<<<< HEAD
    const { title, categoryId } = req.body;

    const chapter = await prisma.chapter.create({
      data: {
        title,
        categoryId: parseInt(categoryId)
      }
    });

    res.status(201).json(chapter);
  } catch (error) {
=======
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newChapter = await prisma.chapter.create({
      data: {
        title,
      },
    });

    res.status(201).json(newChapter);
  } catch (error) {
    console.error(error);
>>>>>>> Fahim2
    res.status(500).json({ message: 'Error creating chapter' });
  }
};

export const updateChapter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const chapter = await prisma.chapter.update({
      where: { id: parseInt(id) },
      data: { title }
    });

    res.json(chapter);
  } catch (error) {
    res.status(500).json({ message: 'Error updating chapter' });
  }
};

export const deleteChapter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.chapter.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting chapter' });
  }
};

export const updateChapterOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { order } = req.body;

    const chapter = await prisma.chapter.update({
      where: { id: parseInt(id) },
      data: { order } as any
    });

    res.json(chapter);
  } catch (error) {
    res.status(500).json({ message: 'Error updating chapter order' });
  }
}; 