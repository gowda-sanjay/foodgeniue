import { getPrisma } from '../config/prisma';

export async function listOffers() {
  return getPrisma().offer.findMany({ orderBy: { createdAt: 'desc' } });
}
