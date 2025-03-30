import { Request, Response, Router } from 'express';
import PrismaSingleton from '../../service/prisma';

const router = Router();

// get all products
router.get('/products', async (_req: Request, res: Response) => {
  try {
    // we can add pagination if needed
    const prisma = PrismaSingleton.getInstance().getPrismaClient();
    const products = await prisma.product.findMany();
    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// add product
router.post('/product', async (req: Request, res: Response) => {
  try {
    const { name, price, stock } = req.body;
    const prisma = PrismaSingleton.getInstance().getPrismaClient();

    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        stock,
      },
    });

    res.status(201).json({ product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// update products
router.patch('/product/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    const prisma = PrismaSingleton.getInstance().getPrismaClient();

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
      },
    });

    res.status(200).json({ product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// delete products
router.delete('/product/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const prisma = PrismaSingleton.getInstance().getPrismaClient();
    const deletedProduct = await prisma.product.delete({ where: { id } });
    res.status(200).json({ product: deletedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// manage inventory
router.post('/inventory', async (req: Request, res: Response) => {
  try {
    const { productId, stock } = req.body;
    const prisma = PrismaSingleton.getInstance().getPrismaClient();

    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const inventory = await prisma.product.update({
      data: { stock: stock + product.stock },
      where: { id: productId },
    });

    res.status(201).json({ inventory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// similary we can add routes for bulk operations

export default router;
