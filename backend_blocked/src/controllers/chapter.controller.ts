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
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    res.json(chapter);
  } catch (error) {
    console.error('Get chapter error:', error);
    res.status(500).json({ message: 'Error fetching chapter' });
  }
};

export const getAllChapters = async (req: Request, res: Response) => {
  try {
    const chapters = await prisma.chapter.findMany({
      orderBy: { order: 'asc' },
      include: {
        exercises: {
          orderBy: { order: 'asc' }
        }
      }
    });

    res.json(chapters);
  } catch (error) {
    console.error('Get all chapters error:', error);
    res.status(500).json({ message: 'Error fetching chapters' });
  }
};

export const createChapter = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newChapter = await prisma.chapter.create({
      data: {
        title,
        order: 0 // Default order
      },
    });

    res.status(201).json(newChapter);
  } catch (error) {
    console.error('Create chapter error:', error);
    res.status(500).json({ message: 'Error creating chapter' });
  }
};

export const updateChapter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const chapter = await prisma.chapter.update({
      where: { id: parseInt(id) },
      data: { title }
    });

    res.json(chapter);
  } catch (error) {
    console.error('Update chapter error:', error);
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
    console.error('Delete chapter error:', error);
    res.status(500).json({ message: 'Error deleting chapter' });
  }
};

export const updateChapterOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { order } = req.body;

    if (typeof order !== 'number') {
      return res.status(400).json({ message: "Order must be a number" });
    }

    const chapter = await prisma.chapter.update({
      where: { id: parseInt(id) },
      data: { order }
    });

    res.json(chapter);
  } catch (error) {
    console.error('Update chapter order error:', error);
    res.status(500).json({ message: 'Error updating chapter order' });
  }
}; 