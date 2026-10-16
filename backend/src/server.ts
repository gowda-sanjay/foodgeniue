import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import http from 'http';
import express, { Application } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from './middlewares/errorHandler';
import { loggerMiddleware } from './middlewares/logger';
import { authRouter } from './routes/authRoutes';
import { userRouter } from './routes/userRoutes';
import { restaurantRouter } from './routes/restaurantRoutes';
import { foodRouter } from './routes/foodRoutes';
import { orderRouter } from './routes/orderRoutes';
import { paymentRouter } from './routes/paymentRoutes';
import { aiRouter } from './routes/aiRoutes';
import { reviewRouter } from './routes/reviewRoutes';
import { offerRouter } from './routes/offerRoutes';
import { adminRouter } from './routes/adminRoutes';
import { socketHandler } from './socket/socketHandler';
import { initPrisma } from './config/prisma';

dotenv.config();

const app: Application = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(loggerMiddleware);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/restaurants', restaurantRouter);
app.use('/api/foods', foodRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/ai', aiRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/offers', offerRouter);
app.use('/api/admin', adminRouter);
app.use(errorHandler);

socketHandler(io);

const port = Number(process.env.PORT || 4000);

initPrisma();

async function ensureAdminUser() {
  const prisma = initPrisma();
  const adminEmail = process.env.ADMIN_EMAIL || 'foodgen@123';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Food@123';
  const adminName = process.env.ADMIN_NAME || 'FoodGenie Admin';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log(`Created admin user: ${adminEmail}`);
  }
}

ensureAdminUser().catch((error) => {
  console.error('Unable to ensure admin user:', error);
});

server.listen(port, () => {
  console.log(`FoodGenie backend running on http://localhost:${port}`);
});
