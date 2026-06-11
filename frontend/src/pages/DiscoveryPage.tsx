import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpDown } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { HeroBanner } from '../components/HeroBanner';
import { useBasket } from '../contexts/BasketContext';
import { useDiscovery } from '../contexts/DiscoveryContext';
import { suburbs } from '../data/products';

export function DiscoveryPage() {
  const navigate = useNavigate();
  const { basket, addToBasket, decreaseBasketQuantity, getProductQuantity } = useBasket();
  const {
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
  } = useDiscovery();
  const orderedCategories = ['dairy', 'fruit', 'vegetables', 'pantry', 'snacks', 'drinks'] as const;

  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const currentPage = Math.min(page, totalPages);
  const visibleProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const basketCount = basket.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-white">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <HeroBanner />
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Left Sidebar - Filters */}
          <aside className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm lg:sticky lg:top-24 lg:h-fit">
            <h2 className="mb-6 text-lg font-bold text-slate-900">Filters</h2>

            {/* Store Location */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-900">Nearest Store</label>
              <select
                value={selectedSuburb}
                onChange={(e) => setSelectedSuburb(e.target.value)}
                className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition hover:border-brand-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              >
                {suburbs.map((suburb: string) => (
                  <option key={suburb} value={suburb}>
                    {suburb}
                  </option>
                ))}
              </select>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-semibold text-slate-900">Categories</label>
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => setCategory('all')}
                  className={`flex w-full rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    category === 'all'
                      ? 'bg-brand-100 text-brand-700'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setCategory('half-price')}
                  className={`flex w-full rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    category === 'half-price'
                      ? 'bg-brand-100 text-brand-700'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  🔥 Half Price
                </button>
                {orderedCategories.filter((cat) => categories.includes(cat)).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`flex w-full rounded-lg px-4 py-2.5 text-sm font-medium capitalize transition ${
                      category === cat
                        ? 'bg-brand-100 text-brand-700'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Content - Search & Products */}
          <div className="lg:col-span-3">
            {/* Search & Sort Section */}
            <div className="mb-8 space-y-4 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
              {/* Search Bar */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Search Products</label>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-brand-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
                  <Search size={18} className="text-brand-600" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products by name..."
                    className="w-full text-sm outline-none"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Sort By</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setSortBy('name')}
                    className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      sortBy === 'name'
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <ArrowUpDown size={14} />
                    Name
                  </button>
                  <button
                    onClick={() => setSortBy('discount')}
                    className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      sortBy === 'discount'
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <ArrowUpDown size={14} />
                    Discount
                  </button>
                  <button
                    onClick={() => setSortBy('price')}
                    className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      sortBy === 'price'
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <ArrowUpDown size={14} />
                    Price
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">
                  Showing <span className="font-semibold text-slate-900">{filteredProducts.length}</span> products
                </p>
                <div className="flex items-center gap-3">
                  <label htmlFor="itemsPerPage" className="text-sm font-medium text-slate-900">
                    Items per page
                  </label>
                  <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition hover:border-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  >
                    {[6, 9, 12, 15].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-2 pb-28">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    expanded={expandedId === product.id}
                    onToggleCompare={() => setExpandedId(expandedId === product.id ? undefined : product.id)}
                    quantity={getProductQuantity(product.id)}
                    onIncrease={() => addToBasket(product.id)}
                    onDecrease={() => decreaseBasketQuantity(product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-16 text-center">
                <p className="text-lg font-semibold text-slate-900">No products found</p>
                <p className="mt-1 text-slate-600">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Basket Button */}
      <div className="fixed bottom-10 right-10 z-50">
        <button
          type="button"
          onClick={() => navigate('/basket')}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-white shadow-soft shadow-brand-500/20 transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-200"
          aria-label="Review basket"
        >
          <span className="text-2xl">🛒</span>
          <span className="absolute -top-2 right-0 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-white px-1.5 text-[11px] font-semibold text-brand-700 shadow-sm">
            {basketCount}
          </span>
        </button>
      </div>
    </main>
  );
}