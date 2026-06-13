import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpDown } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { HeroBanner } from '../components/HeroBanner';
import { useBasket } from '../contexts/BasketContext';
import { useDiscovery } from '../contexts/DiscoveryContext';
import { suburbs } from '../data/products';

const ITEMS_PER_PAGE = 8;

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
    loading,
    error,
  } = useDiscovery();
  const orderedCategories = ['dairy', 'fruit', 'vegetables', 'pantry', 'snacks', 'drinks'] as const;

  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

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

              <div className="mt-4">
                <p className="text-sm text-slate-600">
                  Showing <span className="font-semibold text-slate-900">{filteredProducts.length}</span> products
                </p>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="rounded-2xl border border-brand-100 bg-white py-16 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-900">Loading products...</p>
                <p className="mt-1 text-slate-600">Fetching the latest items from the database</p>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 py-16 text-center">
                <p className="text-lg font-semibold text-red-900">Could not load products</p>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-2">
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

                {totalPages > 1 && (
                  <nav
                    className="mt-8 flex items-center gap-2 overflow-x-auto rounded-2xl border border-brand-100 bg-white p-3 shadow-sm"
                    aria-label="Product pages"
                  >
                    <button
                      type="button"
                      onClick={() => setPage((previousPage) => Math.max(1, previousPage - 1))}
                      disabled={currentPage === 1}
                      className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setPage(pageNumber)}
                        aria-current={pageNumber === currentPage ? 'page' : undefined}
                        className={`h-9 min-w-9 shrink-0 rounded-lg px-2 text-sm font-semibold transition ${
                          pageNumber === currentPage
                            ? 'bg-brand-600 text-white'
                            : 'text-slate-700 hover:bg-brand-50 hover:text-brand-700'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPage((previousPage) => Math.min(totalPages, previousPage + 1))}
                      disabled={currentPage === totalPages}
                      className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </nav>
                )}
                <div className="h-28" />
              </>
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
