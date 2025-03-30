import { User } from '@prisma/client';
import { Request } from 'express';

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    JWT_SECRET: string;
    SESSION_SECRET: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: Partial<ExtendedUser>;
    }
  }
}

interface ExtendedUser extends User {
  role: {
    isAdmin: boolean;
  };
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: { isAdmin: boolean };
  };
}
