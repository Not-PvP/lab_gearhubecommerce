import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { prisma } from './prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const parseNumericId = (value: string | string[] | undefined, fieldName: string): number => {
  const normalizedValue = Array.isArray(value) ? value[0] : value;
  const parsed = Number(normalizedValue);

  if (normalizedValue === undefined || normalizedValue === null || normalizedValue === '' || Number.isNaN(parsed)) {
    throw new Error(`${fieldName} must be a valid number`);
  }

  return parsed;
};

const serializeProduct = (product: {
  id: number;
  name: string;
  category: string | null;
  price: Prisma.Decimal;
  imageUrl: string | null;
  stockQuantity: number;
}) => ({
  id: product.id,
  name: product.name,
  category: product.category,
  price: Number(product.price),
  image_url: product.imageUrl,
  stock_quantity: product.stockQuantity,
});

const serializeUser = (user: { id: number; email: string; isAdmin: boolean }) => ({
  id: user.id,
  email: user.email,
  is_admin: user.isAdmin,
});

const serializeCartItem = (item: { id: number; userId: number; productId: number; quantity: number }) => ({
  id: item.id,
  user_id: item.userId,
  product_id: item.productId,
  quantity: item.quantity,
});

app.get('/api/products', async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
    res.json(products.map(serializeProduct));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const id = parseNumericId(req.params.id, 'Product id');
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(serializeProduct(product));
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid product id' });
  }
});

app.post('/api/users/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        isAdmin: false,
      },
      select: {
        id: true,
        email: true,
        isAdmin: true,
      },
    });

    res.status(201).json(serializeUser(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/users/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    res.json(serializeUser(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

app.get('/api/cart/:userId', async (req: Request, res: Response) => {
  try {
    const userId = parseNumericId(req.params.userId, 'User id');

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { id: 'asc' },
    });

    res.json(
      cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product_id: item.productId,
        name: item.product.name,
        price: Number(item.product.price),
        image_url: item.product.imageUrl,
        stock_quantity: item.product.stockQuantity,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid user id' });
  }
});

app.post('/api/cart', async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity } = req.body as {
      userId?: number | string;
      productId?: number | string;
      quantity?: number | string;
    };

    if (userId == null || productId == null || quantity == null) {
      res.status(400).json({ error: 'userId, productId, and quantity are required' });
      return;
    }

    const parsedUserId = parseNumericId(String(userId), 'User id');
    const parsedProductId = parseNumericId(String(productId), 'Product id');
    const parsedQuantity = Number(quantity);

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      res.status(400).json({ error: 'quantity must be a positive number' });
      return;
    }

    const item = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: parsedUserId,
          productId: parsedProductId,
        },
      },
      update: {
        quantity: { increment: parsedQuantity },
      },
      create: {
        userId: parsedUserId,
        productId: parsedProductId,
        quantity: parsedQuantity,
      },
    });

    res.status(201).json(serializeCartItem(item));
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to add item to cart' });
  }
});

app.put('/api/cart/:id', async (req: Request, res: Response) => {
  try {
    const id = parseNumericId(req.params.id, 'Cart item id');
    const { quantity } = req.body as { quantity?: number | string };

    if (quantity == null) {
      res.status(400).json({ error: 'quantity is required' });
      return;
    }

    const parsedQuantity = Number(quantity);
    if (!Number.isFinite(parsedQuantity)) {
      res.status(400).json({ error: 'quantity must be a valid number' });
      return;
    }

    if (parsedQuantity <= 0) {
      try {
        await prisma.cartItem.delete({ where: { id } });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
          res.status(404).json({ error: 'Cart item not found' });
          return;
        }

        throw error;
      }

      res.json({ deleted: true });
      return;
    }

    const item = await prisma.cartItem.update({
      where: { id },
      data: { quantity: parsedQuantity },
    });

    res.json(serializeCartItem(item));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({ error: 'Cart item not found' });
      return;
    }

    console.error(error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

app.delete('/api/cart/:id', async (req: Request, res: Response) => {
  try {
    const id = parseNumericId(req.params.id, 'Cart item id');

    try {
      await prisma.cartItem.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        res.status(404).json({ error: 'Cart item not found' });
        return;
      }

      throw error;
    }

    res.json({ deleted: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove cart item' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});