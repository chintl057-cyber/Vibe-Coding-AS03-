import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { BasketItem } from '../types';
import { basketApi } from '../api/basket';
import { authApi } from '../api/auth';
import { getApiErrorMessage } from '../api/errors';

interface BasketContextType {
  basket: BasketItem[];
  addToBasket: (productId: string) => void;
  decreaseBasketQuantity: (productId: string) => void;
  getProductQuantity: (productId: string) => number;
  clearBasket: () => void;
  saveBasket: () => Promise<void>;
  loadBasket: () => Promise<void>;
  isLoading: boolean;
  syncError: string | null;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export function BasketProvider({ children }: { children: ReactNode }) {
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Load basket from backend on mount if user is logged in
  useEffect(() => {
    const loadUserBasket = async () => {
      const token = authApi.getToken();
      if (token) {
        try {
          setIsLoading(true);
          await loadBasket();
        } catch (err) {
          setSyncError(getApiErrorMessage(err, 'We could not load your saved basket.'));
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadUserBasket();
  }, []);

  const loadBasket = useCallback(async () => {
    try {
      const response = await basketApi.get();
      if (response.items) {
        setBasket(response.items);
      }
      setSyncError(null);
    } catch (err) {
      if ((err as any)?.response?.status === 404) {
        setBasket([]);
        return;
      }

      console.error('Failed to load basket:', err);
      setSyncError(getApiErrorMessage(err, 'We could not load your saved basket.'));
      throw err;
    }
  }, []);

  const saveBasket = useCallback(async () => {
    if (basket.length === 0) return;
    
    try {
      setIsSyncing(true);
      await basketApi.save(basket);
      setSyncError(null);
    } catch (err) {
      console.error('Failed to save basket:', err);
      setSyncError(getApiErrorMessage(err, 'Your basket could not be saved. Please try again.'));
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, [basket]);

  // Auto-save basket to backend when it changes (debounced)
  useEffect(() => {
    if (basket.length === 0) return;
    if (!authApi.getToken()) return;

    const timer = setTimeout(() => {
      saveBasket().catch((err) => {
        console.error('Auto-save failed:', err);
      });
    }, 1000); // Save 1 second after last change

    return () => clearTimeout(timer);
  }, [basket, saveBasket]);

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
      saveBasket,
      loadBasket,
      isLoading: isLoading || isSyncing,
      syncError,
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
