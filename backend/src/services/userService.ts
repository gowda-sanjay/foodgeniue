import { findUserById, updateUser } from '../repositories/userRepository';
import { ApiError } from '../utils/apiError';

export async function getUserProfile(userId: string) {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
}

export async function updateUserProfile(userId: string, data: any) {
  const user = await updateUser(userId, data);
  return user;
}
