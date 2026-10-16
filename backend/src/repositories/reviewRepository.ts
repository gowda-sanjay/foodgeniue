import { getPrisma } from '../config/prisma';

export async function createReviewRecord(data: any) {
  return getPrisma().review.create({ data });
}

export async function listReviews(query: any) {
  return getPrisma().review.findMany({
    where: {
      restaurantId: query.restaurantId as string | undefined
    },
    include: { user: true }
  });
}
