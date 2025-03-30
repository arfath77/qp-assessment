import { Request, Response, Router } from 'express';
import PrismaSingleton from '../../service/prisma';

const router = Router();

// get all available products
router.get('/products', async (_req: Request, res: Response) => {
  try {
    const prisma = PrismaSingleton.getInstance().getPrismaClient();
    const products = await prisma.product.findMany({
      where: { stock: { gt: 0 } },
    });
    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

export default router;
