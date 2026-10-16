import bcrypt from 'bcryptjs';
import { getPrisma } from '../config/prisma';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import { ApiError } from '../utils/apiError';

export async function registerUser(data: any) {
  const prisma = getPrisma();

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new ApiError(409, 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      role: data.role || 'USER',
      profileImage: data.profileImage,
      address: data.address
    }
  });

  const accessToken = signAccessToken({ id: user.id, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id, role: user.role });

  return { user, accessToken, refreshToken };
}

export async function authenticateUser(data: any) {
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isValid = await bcrypt.compare(data.password, user.password);
  if (!isValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const accessToken = signAccessToken({ id: user.id, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id, role: user.role });

  return { user, accessToken, refreshToken };
}

export async function logoutUser(refreshToken: string) {
  return { success: true };
}

import { verifyRefreshToken } from '../utils/jwt';

export async function refreshTokens(refreshToken: string) {
  try {
    const decoded = verifyRefreshToken(refreshToken) as { id: string; role: string };
    const accessToken = signAccessToken({ id: decoded.id, role: decoded.role });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(401, 'Invalid refresh token');
  }
}
