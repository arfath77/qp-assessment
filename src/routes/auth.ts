import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { LoginUser } from '../zodSchema';
import PrismaSingleton from '../service/prisma';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  LoginUser.parse({ email, password });

  const prisma = PrismaSingleton.getInstance().getPrismaClient();
  // check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  // check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    res.status(401).json({ error: 'Invalid user credentials' });
    return;
  }

  // create JWT token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: '15m',
  });

  // send token to client
  res.status(200).json({
    access_token: token,
  });
});

// logout route

export default router;
