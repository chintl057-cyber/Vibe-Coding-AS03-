import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { products, suburbs } from '../data/products';
import { Category } from '../types';
import { getCheapestStoreForProduct, getPromotionSaving } from '../utils/basket';

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
  filteredProducts: typeof products;
}

const DiscoveryContext = createContext<DiscoveryContextType | undefined>(undefined);

export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ProductFilter>('all');
  const [expandedId, setExpandedId] = useState<string | undefined>();
  const [selectedSuburb, setSelectedSuburb] = useState(suburbs[0]);
  const [sortBy, setSortBy] = useState<SortOption>('name');

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))),
    [],
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

    // Sort based on sortBy
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'discount') {
      filtered.sort((a, b) => getPromotionSaving(b) - getPromotionSaving(a));
    } else if (sortBy === 'price') {
      filtered.sort((a, b) => getCheapestStoreForProduct(a).price - getCheapestStoreForProduct(b).price);
    }

    return filtered;
  }, [category, search, sortBy]);

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