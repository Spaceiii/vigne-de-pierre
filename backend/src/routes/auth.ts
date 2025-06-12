import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { drizzle } from 'drizzle-orm/node-postgres';
import { userTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { AuthenticatedRequest, authRequired } from '../middleware/authRequired.js'

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1h';
const db = drizzle(process.env.DATABASE_URL!);

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({ error: 'Missing required fields.' });
    return;
  }

  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format.' });
    return
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters.' });
    return
  }


  try {
    const existing = await db.select().from(userTable).where(eq(userTable.email, email));
    if (existing.length > 0) {
      res.status(409).json({ error: 'Email already registered.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [user] = await db.insert(userTable).values({
      firstName,
      lastName,
      email,
      passwordHash,
    }).returning();

    const payload = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.status(201).json({ token });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Missing email or password.' });
    return
  }

  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format.' });
    return
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters.' });
    return
  }

  try {
    const users = await db.select().from(userTable).where(eq(userTable.email, email));
    const user = users[0];

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return
    }

    const payload = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ token });
    return
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error.' });
    return
  }
});

router.get('/test', authRequired, (req: AuthenticatedRequest, res) => {
  res.json({ message: 'Auth route is working!' });

  console.log('Authenticated user:', req.user);
})

export default router;
