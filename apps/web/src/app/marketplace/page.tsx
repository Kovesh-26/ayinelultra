'use client';
import { useState, useEffect } from 'react';

interface CustomizationItem {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  previewUrl: string;
  seller: {
    id: string;
    name: string;
    handle: string;
    rating: number;
  };
  rating: number;
  sales: number;
  downloads: number;
  tags: string[];
  category: string;
  createdAt: string;
}

const categories = [
  { name: 'All', count: 0 },
  { name: 'Themes', count: 45 },
  { name: 'Layouts', count: 32 },
  { name: 'Widgets', count: 28 },
  { name: 'Animations', count: 19 },
  { name: 'Music', count: 15 },
];

const types = ['theme', 'layout', 'widget', 'animation', 'music'];

export default function MarketplacePage() {
  const [customizations, setCustomizations] = useState<CustomizationItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    // TODO: Fetch real data from API
    setCustomizations([
      {
        id: '1',
        name: 'Neon Cyberpunk Theme',
        description: 'A futuristic neon theme with cyberpunk aesthetics',
        type: 'theme',
        price: 4.99,
        previewUrl: '/api/placeholder/300/200',
        seller: {
          id: '1',
          name: 'CyberDesigner',
          handle: 'cyberdesigner',
          rating: 4.8,
        },
        rating: 4.8,
        sales: 156,
        downloads: 234,
        tags: ['cyberpunk', 'neon', 'futuristic'],
        category: 'Themes',
        createdAt: '2024-01-15',
      },
      {
        id: '2',
        name: 'Minimalist Grid Layout',
        description: 'Clean and organized grid-based profile layout',
        type: 'layout',
        price: 2.99,
        previewUrl: '/api/placeholder/300/200',
        seller: {
          id: '2',
          name: 'MinimalistPro',
          handle: 'minimalistpro',
          rating: 4.9,
        },
        rating: 4.9,
        sales: 89,
        downloads: 134,
        tags: ['minimalist', 'grid', 'clean'],
        category: 'Layouts',
        createdAt: '2024-01-18',
      },
    ]);
  }, []);

  const filteredCustomizations = customizations.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory)
      return false;
    if (selectedType && item.type !== selectedType) return false;
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (item.price < priceRange.min || item.price > priceRange.max)
      return false;
    return true;
  });

  const sortedCustomizations = [...filteredCustomizations].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'sales':
        return b.sales - a.sales;
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  return (
    <main className="mx-auto max-w-7xl p-4 space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold">
          Profile Customization Marketplace
        </h1>
        <p className="text-lg opacity-70">
          Discover and sell amazing profile customizations
        </p>
      </header>

      {/* Search and Filters */}
      <section className="space-y-4">
        <div className="flex gap-4 flex-wrap">
          <input
            className="flex-1 min-w-64 rounded-xl border px-4 py-2"
            placeholder="Search customizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="rounded-xl border px-4 py-2"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          <select
            className="rounded-xl border px-4 py-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="sales">Most Popular</option>
          </select>
        </div>

        {/* Categories */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-xl border text-sm ${
                selectedCategory === category.name
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Price Range */}
        <div className="flex items-center gap-4">
          <span className="text-sm">Price Range:</span>
          <input
            type="number"
            placeholder="Min"
            className="w-20 rounded-lg border px-2 py-1 text-sm"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange((prev) => ({
                ...prev,
                min: Number(e.target.value),
              }))
            }
          />
          <span className="text-sm">to</span>
          <input
            type="number"
            placeholder="Max"
            className="w-20 rounded-lg border px-2 py-1 text-sm"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange((prev) => ({
                ...prev,
                max: Number(e.target.value),
              }))
            }
          />
        </div>
      </section>

      {/* Results Count */}
      <div className="text-sm opacity-70">
        Showing {sortedCustomizations.length} of {customizations.length}{' '}
        customizations
      </div>

      {/* Customizations Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedCustomizations.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-video bg-gray-100 relative">
              <img
                src={item.previewUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-sm">
                ${item.price}
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold line-clamp-1">{item.name}</h3>
                <p className="text-sm opacity-70 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span>{item.rating}</span>
                  <span className="opacity-70">({item.sales} sales)</span>
                </div>
                <span className="text-xs opacity-70 capitalize">
                  {item.type}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="opacity-70">by</span>
                <span className="font-medium">@{item.seller.handle}</span>
                <span className="text-yellow-500">★</span>
                <span>{item.seller.rating}</span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 rounded-xl bg-blue-500 text-white py-2 text-sm font-medium hover:bg-blue-600 transition-colors">
                  Purchase
                </button>
                <button className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50 transition-colors">
                  Preview
                </button>
              </div>

              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 rounded-lg text-xs opacity-70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Empty State */}
      {sortedCustomizations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">
            No customizations found
          </h3>
          <p className="opacity-70">
            Try adjusting your search criteria or browse all categories
          </p>
        </div>
      )}

      {/* Sell Your Customization */}
      <section className="rounded-2xl border p-6 text-center bg-gradient-to-r from-blue-50 to-purple-50">
        <h2 className="text-2xl font-semibold mb-2">Have a great idea?</h2>
        <p className="opacity-70 mb-4">
          Create and sell your own profile customizations to the community
        </p>
        <button className="rounded-xl bg-blue-500 text-white px-6 py-3 font-medium hover:bg-blue-600 transition-colors">
          Start Selling
        </button>
      </section>
    </main>
  );
}
