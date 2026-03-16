'use client';

import { useState } from 'react';
import { useCartStore } from '../lib/cart-store';

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  price: number;
  image: string;
}

export default function AddToCartButton({ 
  productId, 
  productName, 
  price, 
  image 
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async () => {
    setIsAdding(true);

    // OPTIMISTIC UPDATE - Update UI immediately
    addItem({
      id: productId,
      name: productName,
      price,
      image,
      quantity: 1,
    });

    // Show success feedback instantly
    showToast('Added to cart!');

    try {
      // Send API request in background
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      // Success - optimistic update was correct
      console.log('Cart synced with server');
    } catch (error) {
      // Failure - revert the optimistic update
      console.error('Failed to add to cart:', error);
      useCartStore.getState().removeItem(productId);
      showToast('Failed to add item. Please try again.', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className="w-full bg-black text-white py-4 px-6 rounded-full font-medium
                 hover:bg-gray-800 transition-colors disabled:bg-gray-400
                 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      aria-label={`Add ${productName} to cart`}
    >
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}

// Simple toast notification
function showToast(message: string, type: 'success' | 'error' = 'success') {
  // In production, use a proper toast library like react-hot-toast
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white z-50
    ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
