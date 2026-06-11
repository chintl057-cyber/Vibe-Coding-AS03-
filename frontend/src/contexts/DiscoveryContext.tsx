import { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { Category } from '../types';
import { getCheapestStoreForProduct, getPromotionSaving } from '../utils/basket';
import { productsApi } from '../api/products';
import type { Product } from '../types';

type SortOption = 'name' | 'discount' | 'price';
type ProductFilter = Category | 'all' | 'half-price';

interface DiscoveryContextType {
  search: string;
  setSearch: (value: string) => void;
  category: ProductFilter;
  setCategory: (value: ProductFilter) => void;
  expandedId?: string;
  setExpandedId: (id: string | undefined) => void;
  selectedSuburb: string;
  setSelectedSuburb: (location: string) => void;
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  categories: Category[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
}

const DiscoveryContext = createContext<DiscoveryContextType | undefined>(undefined);

const suburbs = ['Melbourne CBD', 'Southbank', 'Richmond', 'Carlton', 'Docklands'];

export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ProductFilter>('all');
  const [expandedId, setExpandedId] = useState<string | undefined>();
  const [selectedSuburb, setSelectedSuburb] = useState(suburbs[0]);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('Starting to fetch products...');
        const data = await productsApi.getAll(0, 1000);
        console.log('Products fetched:', data);
        console.log('Products count:', data?.length);
        setProducts(data || []);
        setError(null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch products';
        console.error('Error fetching products:', err);
        console.error('Error details:', errorMsg);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))),
    [products],
  );

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchCategory =
        category === 'all'
          ? true
          : category === 'half-price'
            ? Boolean(product.promotion?.isHalfPrice)
            : product.category === category;
      const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });

    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'discount') {
      filtered.sort((a, b) => getPromotionSaving(b) - getPromotionSaving(a));
    } else if (sortBy === 'price') {
      filtered.sort((a, b) => getCheapestStoreForProduct(a).price - getCheapestStoreForProduct(b).price);
    }

    return filtered;
  }, [category, search, sortBy, products]);

  return (
    <DiscoveryContext.Provider value={{
      search,
      setSearch,
      category,
      setCategory,
      expandedId,
      setExpandedId,
      selectedSuburb,
      setSelectedSuburb,
      sortBy,
      setSortBy,
      categories,
      filteredProducts,
      loading,
      error,
    }}>
      {children}
    </DiscoveryContext.Provider>
  );
}

export function useDiscovery() {
  const context = useContext(DiscoveryContext);
  if (context === undefined) {
    throw new Error('useDiscovery must be used within a DiscoveryProvider');
  }
  return context;
}
