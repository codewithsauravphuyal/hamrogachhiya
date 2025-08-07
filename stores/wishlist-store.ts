import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  storeId: string;
  storeName: string;
}

interface WishlistStore {
  items: WishlistItem[];
  itemCount: number;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (itemId: string) => void;
  isInWishlist: (itemId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      addToWishlist: (item) => {
        const { items } = get();
        if (!items.find(i => i.id === item.id)) {
          const newItems = [...items, item];
          set({ items: newItems, itemCount: newItems.length });
        }
      },
      removeFromWishlist: (itemId) => {
        const newItems = get().items.filter(item => item.id !== itemId);
        set({ items: newItems, itemCount: newItems.length });
      },
      clearWishlist: () => set({ items: [], itemCount: 0 }),
      isInWishlist: (itemId) => get().items.some(item => item.id === itemId),
    }),
    {
      name: 'wishlist-storage',
    }
  )
); 