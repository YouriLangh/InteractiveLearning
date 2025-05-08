import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
<<<<<<< HEAD
=======

>>>>>>> Fahim2
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
<<<<<<< HEAD
        email: true,
        role: true,
        createdAt: true
      }
=======
        role: true,
        code: true,
        createdAt: true,
      },
>>>>>>> Fahim2
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
<<<<<<< HEAD
    const { name, email } = req.body;
=======
    const { name } = req.body;
>>>>>>> Fahim2

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
<<<<<<< HEAD
        email
=======
>>>>>>> Fahim2
      },
      select: {
        id: true,
        name: true,
<<<<<<< HEAD
        email: true,
        role: true,
        createdAt: true
      }
=======
        role: true,
        code: true,
        createdAt: true,
      },
>>>>>>> Fahim2
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile' });
  }
<<<<<<< HEAD
}; 
=======
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });

    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching students' });
  }
};
>>>>>>> Fahim2
