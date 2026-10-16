import { create } from 'zustand';
import type { FoodItem } from '@/data/restaurants';

interface OrderState {
  selectedItem: FoodItem | null;
  setSelectedItem: (item: FoodItem) => void;
  clearOrder: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  selectedItem: null,
  setSelectedItem: (item) => set({ selectedItem: item }),
  clearOrder: () => set({ selectedItem: null }),
}));
