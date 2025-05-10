import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

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

  try {
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
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Login Controller
 * Allows user to login using name and code.
 */
export const login = async (req: Request, res: Response): Promise<Response | void> => {
  const { name, code, role } = req.body;

  console.log('Login request received:', { name, code, role });

  if (!name || !code || !role) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'Name, code, and role are required' });
  }

  try {
    // Find user with matching (name + code)
    const user = await prisma.user.findUnique({
      where: {
        name_code: {
          name,
          code,
        },
      },
    });

    console.log('Found user:', user);

    if (!user) {
      return res.status(401).json({ error: 'Invalid name or code' });
    }

    // Validate role
    if (user.role.toUpperCase() !== role.toUpperCase()) {
      console.log('Role mismatch:', { userRole: user.role, requestedRole: role });
      return res.status(403).json({ error: 'Invalid role for this account' });
    }

    // Generate JWT Token
    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    const response = {
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    };

    console.log('Sending login response:', response);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
