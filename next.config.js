import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isGuest: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  syncToAccount: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isGuest: true,

      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === newItem.id);
          
          if (existingItem) {
            // Update quantity if item already exists
            return {
              items: state.items.map(item =>
                item.id === newItem.id
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              ),
            };
          }
          
          // Add new item
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      // Sync guest cart to user account when they sign up
      syncToAccount: async () => {
        const { items } = get();
        
        if (items.length === 0) return;

        try {
          await fetch('/api/cart/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
          });

          set({ isGuest: false });
          console.log('Cart synced to account successfully');
        } catch (error) {
          console.error('Failed to sync cart:', error);
          throw error;
        }
      },
    }),
    {
      name: 'nike-cart-storage', // localStorage key
      // Only persist items, not isGuest status
      partialize: (state) => ({ items: state.items }),
    }
  )
);
