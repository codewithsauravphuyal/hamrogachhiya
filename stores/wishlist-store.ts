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
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (itemId: string) => void;
  isInWishlist: (itemId: string) => boolean;
  clearWishlist: () => void;
  itemCount: number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToWishlist: (item) => {
        const { items } = get();
        const existingItem = items.find(i => i.id === item.id);
        
        if (!existingItem) {
          set({ items: [...items, item] });
        }
      },
      
      removeFromWishlist: (itemId) => {
        const { items } = get();
        set({ items: items.filter(item => item.id !== itemId) });
      },
      
      isInWishlist: (itemId) => {
        const { items } = get();
        return items.some(item => item.id === itemId);
      },
      
      clearWishlist: () => {
        set({ items: [] });
      },
      
      get itemCount() {
        return get().items.length;
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
); 