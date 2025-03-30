import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import PrismaSingleton from '../service/prisma';
import { AuthenticatedRequest } from '../custom';

export const authorizeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // Attach user information to the request object
    const prisma = PrismaSingleton.getInstance().getPrismaClient();
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            isAdmin: true,
          },
        },
      },
      where: { id: (decoded as any).id },
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    (req as AuthenticatedRequest).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as AuthenticatedRequest)?.user;
  console.log(user);
  if (!user || !user?.role?.isAdmin) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  next();
};
