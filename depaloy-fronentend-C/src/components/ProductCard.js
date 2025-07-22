'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { volkhov, jost } from '../lib/fonts';
import useFilter from '../store/useProductFilterStore';
import { useCategoryStore } from '../store/categoryStore.js';
import { toast } from 'react-toastify';
import React from 'react';
import SidebarFilters from '../components/SidebarFilters';

export default function ProductCard({ sortOption }) {
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedVariantIndex, setSelectedVariantIndex] = useState({});
  const [showContent, setShowContent] = useState(false);
  const [currentActiveTag, setCurrentActiveTag] = useState('');
  const filterHeaderRef = useRef(null);
  const [isHeaderStable, setIsHeaderStable] = useState(false);

  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const {
    products,
    totalPages,
    loading,
    error,
    activeFilters,
    activeTag,
    fetchProductsByFilters,
    setActiveFilters,
    setActiveTag,
    setSearchQuery,
  } = useFilter();

  const fallbackImage = '/images/D-img.jpg';

  // Function to check if a URL is a video
  const isVideoUrl = (url) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  // Modified getCurrentImage to return both URL and type
  const getCurrentImage = useCallback(
    (product) => {
      const variantIndex = selectedVariantIndex[product._id] ?? 0;
      const variant = product.variants?.[variantIndex];
      if (variant?.images?.length > 0) {
        const primary = variant.images.find((img) => img.isPrimary);
        const imgUrl = primary?.url || variant.images[0].url;
        const fullUrl = imgUrl.startsWith('http') ? imgUrl : `${baseURL}${imgUrl}`;
        return {
          url: fullUrl,
          isVideo: isVideoUrl(fullUrl),
        };
      }
      return {
        url: fallbackImage,
        isVideo: false,
      };
    },
    [selectedVariantIndex, baseURL, fallbackImage]
  );

  const getFinalPrice = useCallback(
    (product) => {
      const variantIndex = selectedVariantIndex[product._id] ?? 0;
      const variant = product.variants?.[variantIndex];
      return variant?.finalPrice ?? product.base_price;
    },
    [selectedVariantIndex]
  );

  // Handle external sortOption prop
  useEffect(() => {
    if (sortOption && sortOption !== 'default') {
      const sortMapping = {
        'price-asc': 'price-low-high',
        'price-desc': 'price-high-low',
        'name-asc': 'newest',
        'name-desc': 'oldest',
        'default': 'newest',
      };
      setSortBy(sortMapping[sortOption] || 'newest');
    }
  }, [sortOption]);

  // On mount: set tag, fetch products
  useEffect(() => {
    const controller = new AbortController();
    const savedTag = localStorage.getItem('activeTag') || '';

    setCurrentActiveTag(savedTag);
    setActiveFilters({ ...activeFilters, tags: [savedTag] });

    if (setActiveTag) {
      setActiveTag(savedTag);
    }

    fetchProductsByFilters(
      { tags: [savedTag], page: 1, limit: itemsPerPage, search: activeFilters.search || '' },
      controller.signal
    )
      .then(() => {
        setIsHeaderStable(true);
      })
      .catch((err) => {
        console.error('❌ fetchProductsByFilters error:', err);
        if (err.name !== 'AbortError') {
          toast.error(`Failed to fetch products: ${err.message}`);
        }
      });

    return () => {
      controller.abort();
    };
  }, [setActiveFilters, fetchProductsByFilters, setActiveTag, activeFilters.search]);

  // Variant pre-selection map
  useEffect(() => {
    if (products && products.length > 0) {
      const indexMap = {};
      products.forEach((product) => {
        if (product.variants?.length > 0) {
          indexMap[product._id] = 0;
        }
      });
      setSelectedVariantIndex(indexMap);
    }
  }, [products]);

  // Toggle loader display
  useEffect(() => {
    if (!loading) {
      if (products.length > 0) {
        const timer = setTimeout(() => {
          setShowContent(true);
          setIsHeaderStable(true);
        }, 1000);
        return () => {
          clearTimeout(timer);
        };
      } else {
        setShowContent(true);
        setIsHeaderStable(true);
      }
    } else {
      setShowContent(false);
    }
  }, [loading, products]);

  // Toast error
  useEffect(() => {
    if (error) {
      if (!error.includes('retrieved successfully')) {
        toast.error(`Error: ${error}`);
      }
    }
  }, [error]);

  const handleCategoryChange = useCallback(
    (e) => {
      const tag = e.target.value === 'all' ? '' : e.target.value;

      setCurrentActiveTag(tag);
      localStorage.setItem('activeTag', tag);

      if (setActiveTag) {
        setActiveTag(tag);
      }

      const updatedFilters = {
        tags: tag ? [tag] : [],
        colors: [],
        brands: [],
        sizes: [],
        collections: [],
        minPrice: null,
        maxPrice: null,
        search: activeFilters.search || '',
      };

      setActiveFilters(updatedFilters);
      fetchProductsByFilters({ ...updatedFilters, page: 1, limit: itemsPerPage })
        .then(() => {
          console.log('✅ Category change - products fetched');
        })
        .catch((err) => {
          console.error('❌ Category change - fetch error:', err);
          if (err.name !== 'AbortError') {
            toast.error(`Failed to fetch products: ${err.message}`);
          }
        });

      setCurrentPage(1);
    },
    [setActiveTag, setActiveFilters, fetchProductsByFilters, itemsPerPage, activeFilters.search]
  );

  const handleSortChange = useCallback((value) => {
    setSortBy(value);
  }, []);

  const handlePageChange = useCallback(
    (page) => {
      setCurrentPage(page);
      fetchProductsByFilters({ ...activeFilters, page, limit: itemsPerPage })
        .then(() => {
          console.log('✅ Page change - products fetched');
        })
        .catch((err) => {
          console.error('❌ Page change - fetch error:', err);
          if (err.name !== 'AbortError') {
            toast.error(`Failed to fetch products: ${err.message}`);
          }
        });
    },
    [activeFilters, fetchProductsByFilters, itemsPerPage]
  );

  const handleColorClick = useCallback((productId, variantIndex) => {
    setSelectedVariantIndex((prev) => ({
      ...prev,
      [productId]: variantIndex,
    }));
  }, []);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price-low-high':
          return getFinalPrice(a) - getFinalPrice(b);
        case 'price-high-low':
          return getFinalPrice(b) - getFinalPrice(a);
        default:
          return 0;
      }
    });
  }, [products, sortBy, getFinalPrice]);

  if (loading || !showContent) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        {isHeaderStable && (
          <StableFilterHeader
            sortBy={sortBy}
            onSortChange={handleSortChange}
            onTagChange={handleCategoryChange}
            activeTag={currentActiveTag}
          />
        )}
        <div className="flex justify-center items-center min-h-[500px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!loading && showContent && products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <StableFilterHeader
          sortBy={sortBy}
          onSortChange={handleSortChange}
          onTagChange={handleCategoryChange}
          activeTag={currentActiveTag}
        />
        <div className="text-center mt-20">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1M7 8h10l-1 8H8L7 8z"
            />
          </svg>
          <h3 className={`text-xl font-medium text-gray-900 mb-2 ${volkhov.className}`}>
            Sorry, Products Not Available
          </h3>
          <p className={`text-gray-500 ${jost.className}`}>
            No products found. Try different filters or check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <StableFilterHeader
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onTagChange={handleCategoryChange}
        activeTag={currentActiveTag}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sortedProducts.map((product) => {
          const finalPrice = getFinalPrice(product)?.toFixed(2);
          const selectedColor = product.variants?.[selectedVariantIndex[product._id]]?.color?.name;
          const { url: mediaUrl, isVideo } = getCurrentImage(product);

          return (
            <Link href={`/fashion/${product._id}`} key={product._id}>
              <div className="p-3 rounded hover:shadow-lg transition cursor-pointer">
                <div className="relative w-full aspect-[3/4] rounded overflow-hidden mb-3">
                  {isVideo ? (
                    <video
                      src={mediaUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="object-cover w-full h-full transition-all duration-300"
                      aria-label={product.name}
                    />
                  ) : (
                    <Image
                      src={mediaUrl}
                      alt={product.name}
                      fill
                      className="object-cover transition-all duration-300"
                      priority={product === sortedProducts[0]}
                    />
                  )}
                </div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 pr-2">
                    <h3 className={`text-[16px] font-medium mb-1 ${volkhov.className}`}>
                      {product.name}
                    </h3>
                    <p className={`text-[16px] text-gray-700 font-medium ${jost.className}`}>
                      ₹{finalPrice}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const productURL = `${window.location.origin}/fashion/${product._id}`;
                        const message = `Hi, I want to buy this product:

🛍️ *Name:* ${product.name}
🔗 *Link:* ${productURL}
🎨 *Price:* ₹${finalPrice}
💰 *Color:* ${selectedColor || 'Not selected yet'}
🧮 *Quantity:* 1`;

                        const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER;
                        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                          message
                        )}`;
                        window.open(whatsappURL, '_blank');
                      }}
                      className="flex items-center cursor-pointer gap-1 px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.52 3.48A11.87 11.87 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.18 1.6 6L0 24l6.26-1.63A11.87 11.87 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.2-3.48-8.52zM12 22a9.89 9.89 0 01-5.28-1.52l-.38-.24-3.73.98.99-3.62-.25-.39A9.89 9.89 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.63l-1.73-.5c-.23-.07-.48 0-.65.18l-.63.64a9.34 9.34 0 01-4.25-4.25l.64-.63c.18-.18.25-.43.18-.65l-.5-1.73a.51.51 0 00-.61-.35 7.25 7.25 0 00-2.29 1.45.54.54 0 00-.16.38c0 4.13 3.35 7.48 7.48 7.48.14 0 .27-.06.38-.16a7.25 7.25 0 001.45-2.29.51.51 0 00-.35-.61z" />
                      </svg>
                      Buy Now
                    </button>
                    <div>
                      {!product.isSoldOut ? (
                        <span className="text-green-700 text-xs font-medium bg-green-100 px-2 py-1 rounded-full">
                          ✅ Available
                        </span>
                      ) : (
                        <span className="text-red-600 text-xs font-medium bg-red-100 px-2 py-1 rounded-full">
                          Sold Out
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.variants?.map((variant, index) => (
                    <button
                      key={variant._id || `${product._id}-var-${index}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleColorClick(product._id, index);
                      }}
                      className={`w-5 h-5 rounded-full cursor-pointer transition-all relative ${
                        selectedVariantIndex[product._id] === index
                          ? 'scale-110 ring-2 ring-offset-2 ring-gray-800'
                          : 'hover:scale-105 hover:ring-2 hover:ring-offset-1 hover:ring-gray-400'
                      }`}
                      style={{ backgroundColor: variant.color?.hex || '#ccc' }}
                      aria-label={`Color ${variant.color?.name}`}
                      title={variant.color?.name || 'Color'}
                    />
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6">
          <div className="flex items-center space-x-2">
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-2 py-2 text-gray-800 hover:text-gray-600"
              >
                ←
              </button>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={`page-${page}`}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  currentPage === page ? 'bg-gray-300 text-gray-800' : 'text-gray-800 hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
            {currentPage < totalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-2 py-2 text-gray-800 hover:text-gray-600"
              >
                →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const StableFilterHeader = ({ sortBy, onSortChange, onTagChange, activeTag }) => {
  const [mounted, setMounted] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { setSearchQuery, fetchProductsByFilters, activeFilters } = useFilter();
  const { categories, loading, error, fetchUsedCategories } = useCategoryStore();
  const itemsPerPage = 12;
  const debounceTimeout = useRef(null); // For debouncing search

  // Fetch categories on mount
  useEffect(() => {
    fetchUsedCategories();
    setMounted(true);
  }, [fetchUsedCategories]);

  // Handle category fetch errors
  useEffect(() => {
    if (error) {
      toast.error(`Error fetching categories: ${error}`);
    }
  }, [error]);

  // Debounced search handler
  const handleSearchChange = useCallback(
    (value) => {
      setSearchValue(value);
      setSearchQuery(value.trim());

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        fetchProductsByFilters({
          ...activeFilters,
          search: value.trim(),
          page: 1,
          limit: itemsPerPage,
        })
          .then(() => console.log('✅ Search products fetched'))
          .catch((err) => {
            if (err.name !== 'AbortError') {
              toast.error(`Failed to fetch products: ${err.message}`);
            }
          });
      }, 300);
    },
    [setSearchQuery, fetchProductsByFilters, activeFilters, itemsPerPage]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  // Handle category change
  const handleCategoryChange = (e) => {
    const selectedSlug = e.target.value === 'all' ? '' : e.target.value;
    localStorage.setItem('activeTag', selectedSlug);
    onTagChange(e);
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-4 mb-4">
      {/* Search Bar */}
      <div className="flex w-full gap-2">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-300 transition"
          aria-label="Search products"
        />
      </div>
      {/* Category and Sort Dropdowns */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-48">
          <select
            value={activeTag || 'all'}
            onChange={handleCategoryChange}
            aria-label="Select category"
            className="appearance-none w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:border-blue-300 transition pr-10 cursor-pointer"
            disabled={loading}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div className="relative w-full sm:w-48">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort products"
            className="appearance-none w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:border-blue-300 transition pr-10 cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      {/* Show SidebarFilters only on tablet and smaller screens (below lg) */}
      <div className="w-full lg:hidden">
        <SidebarFilters />
      </div>
    </div>
  );
};