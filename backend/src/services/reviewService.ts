import { createReviewRecord, listReviews } from '../repositories/reviewRepository';

export async function createReview(userId: string, data: any) {
  return createReviewRecord({
    userId,
    restaurantId: data.restaurantId,
    rating: data.rating,
    comment: data.comment
  });
}

export async function getReviews(query: any) {
  return listReviews(query);
}
