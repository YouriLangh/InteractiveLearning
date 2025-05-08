import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
<<<<<<< HEAD
import { hashPassword, comparePassword } from '../utils/hash';
=======
>>>>>>> Fahim2
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

<<<<<<< HEAD
export const signup = async (req: Request, res: Response): Promise<Response | void> => {
    const { name, email, password, role } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: 'Email in use' });

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role },
  });

  return res.json({ message: 'User created' });
};

export const login = async (req: Request, res: Response): Promise<Response | void> => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await comparePassword(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken({ id: user.id, role: user.role });
  return res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
=======
/**
 * Signup Controller
 * Allows user to sign up with name, code, and role.
 * (name + code) combination must be unique.
 */
export const signup = async (req: Request, res: Response): Promise<Response | void> => {
  const { name, code, role } = req.body;

  if (!name || !code || !role) {
    return res.status(400).json({ error: 'Name, code, and role are required' });
  }

  // Check if (name + code) already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      name_code: {
        name,
        code,
      },
    },
  });

  if (existingUser) {
    return res.status(400).json({ error: 'This name and code combination is already taken' });
  }

  // Create new user
  const user = await prisma.user.create({
    data: { name, code, role },
  });

  return res.status(200).json({ message: 'User created successfully' });
};

/**
 * Login Controller
 * Allows user to login using name and code.
 */
export const login = async (req: Request, res: Response): Promise<Response | void> => {
  const { name, code } = req.body;

  if (!name || !code) {
    return res.status(400).json({ error: 'Name and code are required' });
  }

  // Find user with matching (name + code)
  const user = await prisma.user.findUnique({
    where: {
      name_code: {
        name,
        code,
      },
    },
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid name or code' });
  }

  // Generate JWT Token
  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  return res.status(200).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
  });
>>>>>>> Fahim2
};
