import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartState, CartItem, Product, ProductVariant } from '@/types';

interface CartStore extends CartState {
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      
      addItem: (product: Product, quantity = 1, variant?: ProductVariant) => {
        const state = get();
        const existingItem = state.items.find(item => 
          item.productId === product.id && 
          item.selectedVariant?.id === (variant?.id || null)
        );

        if (existingItem) {
          // Update existing item quantity
          set(state => ({
            items: state.items.map(item =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          }));
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `${product.id}-${variant?.id || 'default'}-${Date.now()}`,
            productId: product.id,
            product: product,
            quantity,
            selectedVariant: variant || undefined
          };

          set(state => ({
            items: [...state.items, newItem],
          }));
        }

        get().calculateTotal();
      },
      
      removeItem: (itemId: string) => {
        set(state => ({
          items: state.items.filter(item => item.id !== itemId),
        }));
        get().calculateTotal();
      },
      
      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set(state => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
        get().calculateTotal();
      },
      
      clearCart: () => {
        set({ items: [], total: 0, itemCount: 0 });
      },
      
      calculateTotal: () => {
        const state = get();
        const total = state.items.reduce((sum, item) => {
          const price = item.selectedVariant?.price || item.product.price;
          return sum + (price * item.quantity);
        }, 0);
        const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
        
        set({ total, itemCount });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
); 