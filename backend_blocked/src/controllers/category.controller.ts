import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' } as any,
      include: {
        chapters: {
          orderBy: { order: 'asc' } as any
        }
      }
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { title, color, iconPath } = req.body;

    const category = await prisma.category.create({
      data: {
        title,
        color,
        iconPath
      }
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, color, iconPath } = req.body;

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        title,
        color,
        iconPath
      }
    });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' });
  }
};

export const updateCategoryOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { order } = req.body;

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { order } as any
    });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category order' });
  }
}; 