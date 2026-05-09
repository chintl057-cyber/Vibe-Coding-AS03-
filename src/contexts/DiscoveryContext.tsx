import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { products, suburbs } from '../data/products';
import { Category } from '../types';

type SortOption = 'name' | 'discount' | 'price';

interface DiscoveryContextType {
  search: string;
  setSearch: (value: string) => void;
  category: Category | 'all';
  setCategory: (value: Category | 'all') => void;
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
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | undefined>();
  const [selectedSuburb, setSelectedSuburb] = useState(suburbs[0]);
  const [sortBy, setSortBy] = useState<SortOption>('name');

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))),
    [],
  );

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchCategory = category === 'all' || product.category === category;
      const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });

    // Sort based on sortBy
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'discount') {
      filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    } else if (sortBy === 'price') {
      filtered.sort((a, b) => a.price - b.price);
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