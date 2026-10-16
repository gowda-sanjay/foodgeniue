import { getPrisma } from '../config/prisma';

export async function findUserByEmail(email: string) {
  return getPrisma().user.findUnique({ where: { email } });
}

export async function findUserById(id: string) {
  return getPrisma().user.findUnique({ where: { id } });
}

export async function createUser(data: any) {
  return getPrisma().user.create({ data });
}

export async function updateUser(id: string, data: any) {
  return getPrisma().user.update({ where: { id }, data });
}
