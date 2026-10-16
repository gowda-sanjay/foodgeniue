import { listOffers } from '../repositories/offerRepository';

export async function fetchOffers() {
  return listOffers();
}
