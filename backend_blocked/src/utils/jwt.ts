import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET!;

export const generateToken = (user: { id: number, role: string }) => {
  return jwt.sign(user, secret, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, secret);
};
