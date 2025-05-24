// This file handles user signup and login
// It helps create new accounts and lets users sign in to the app
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

/**
 * Signup Controller
 * Creates a new user account with name, code, and role
 * Makes sure no two users have the same name and code
 */
export const signup = async (req: Request, res: Response): Promise<Response | void> => {
  const { name, code, role } = req.body;

  // Check if all required fields are provided
  if (!name || !code || !role) {
    return res.status(400).json({ error: 'Name, code, and role are required' });
  }

  try {
    // Check if this name and code combination is already taken
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

    // Create the new user account
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
 * Lets users sign in with their name and code
 * Checks if the account exists and gives them a special token to use the app
 */
export const login = async (req: Request, res: Response): Promise<Response | void> => {
  const { name, code, role } = req.body;

  console.log('Login request received:', { name, code, role });

  // Check if all required fields are provided
  if (!name || !code || !role) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'Name, code, and role are required' });
  }

  try {
    // Find the user with matching name and code
    const user = await prisma.user.findUnique({
      where: {
        name_code: {
          name,
          code,
        },
      },
    });

    console.log('Found user:', user);

    // If no user found, return error
    if (!user) {
      return res.status(401).json({ error: 'Invalid name or code' });
    }

    // Check if the role matches (student or teacher)
    if (user.role.toUpperCase() !== role.toUpperCase()) {
      console.log('Role mismatch:', { userRole: user.role, requestedRole: role });
      return res.status(403).json({ error: 'Invalid role for this account' });
    }

    // Create a special token for the user
    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    // Send back the token and user info
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
