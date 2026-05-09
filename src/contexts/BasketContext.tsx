import { createContext, useContext, useState, ReactNode } from 'react';
import { BasketItem } from '../types';

interface BasketContextType {
  basket: BasketItem[];
  addToBasket: (productId: string) => void;
  decreaseBasketQuantity: (productId: string) => void;
  getProductQuantity: (productId: string) => number;
  clearBasket: () => void;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export function BasketProvider({ children }: { children: ReactNode }) {
  const [basket, setBasket] = useState<BasketItem[]>([]);

  const addToBasket = (productId: string) => {
    setBasket((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const decreaseBasketQuantity = (productId: string) => {
    setBasket((prev) =>
      prev
        .map((item) =>
          item.productId === productId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const getProductQuantity = (productId: string) => {
    return basket.find((item) => item.productId === productId)?.quantity ?? 0;
  };

  const clearBasket = () => {
    setBasket([]);
  };

  return (
    <BasketContext.Provider value={{
      basket,
      addToBasket,
      decreaseBasketQuantity,
      getProductQuantity,
      clearBasket,
    }}>
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (context === undefined) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
}