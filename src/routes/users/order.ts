import { Request, Response, Router } from 'express';
import PrismaSingleton from '../../service/prisma';
import { AuthenticatedRequest } from '../../custom';

const router = Router();

router.post('/order', async (req: Request, res: Response) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    const { order } = req.body as {
      order: { productId: string; quantity: number }[];
    };

    const prisma = PrismaSingleton.getInstance().getPrismaClient();

    const getProductId = order.map(el => el.productId);

    // Check if the product exists
    const products = await prisma.product.findMany({
      where: { id: { in: getProductId } },
      select: { id: true, stock: true, price: true },
    });

    if (!products.length) {
      res.status(404).json({ error: 'Products not found' });
      return;
    }

    // Check if there is enough stock for each product
    const insufficientStock = products.filter(product => {
      const orderItem = order.find(item => item.productId === product.id);
      return (product.stock ?? 0) < (orderItem?.quantity ?? 0);
    });

    if (insufficientStock.length) {
      res.status(400).json({ error: 'Not enough stock available' });
      return;
    }

    // Create the order
    await prisma.order.create({
      data: {
        userId: user?.id, // Assuming a default user ID for the sake of example
        orderItems: {
          create: order.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });

    // Update the product's stock
    await prisma.$transaction(async prisma => {
      console.log('updating stock');
      await Promise.all(
        order.map(async item => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            await prisma.product.update({
              where: { id: product.id },
              data: { stock: Number(product.stock) - item.quantity },
            });
          }
        })
      );
    });

    res.status(200).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

export default router;
