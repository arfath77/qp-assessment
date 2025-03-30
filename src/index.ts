require('dotenv').config();

import express, { Request, Response } from 'express';
import session from 'express-session';

import PrismaSingleton from './service/prisma';
import { insertDummyData } from './dummyData';
import loginRouter from './routes/auth';
import adminRouter from './routes/admin/productAction';
import userProductRouter from './routes/users/product';
import userOrderRouter from './routes/users/order';
import { authorizeUser, authorizeAdmin } from './middleware/authorizeUser';

const app = express();

const prismaSingleton = PrismaSingleton.getInstance();

// insertDummyData();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET!,
  })
);

app.get('/ping', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'pong' });
});

app.use('/auth', loginRouter);

app.use('/user', authorizeUser, userProductRouter);
app.use('/user', authorizeUser, userOrderRouter);

app.use('/admin', authorizeUser, authorizeAdmin, adminRouter);

// Start server
const port: number = Number(process.env.PORT) || 3000;
app.listen(port, async () => {
  try {
    await prismaSingleton.connectToPrisma();
    console.log(`Server running on port ${port}`);
  } catch (error) {
    console.error('Error starting server:', error);
  }
});

export default app;
