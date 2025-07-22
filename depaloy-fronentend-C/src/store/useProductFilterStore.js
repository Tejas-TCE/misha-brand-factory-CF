import { create } from 'zustand';

const useFilter = create((set, get) => {
  const savedTag = typeof window !== 'undefined'
    ? localStorage.getItem('activeTag') || ''
    : '';

  return {
    products: [],
    colors: [],
    brands: [],
    sizes: [],
    collections: [],
    tags: [],
    activeTag: savedTag,
    activeFilters: {
      tags: [savedTag],
      colors: [],
      brands: [],
      sizes: [],
      collections: [],
      minPrice: null,
      maxPrice: null,
      availability: {},
      search: '',
    },
    totalPages: 1,
    loading: false,
    error: null,

    fetchProductsByFilters: async (filters = {}, signal) => {
      set({ loading: true, error: null });
      try {
        const queryParams = new URLSearchParams();

        if (filters.colors?.length) {
          filters.colors.forEach((colorId) => queryParams.append('colors', colorId));
        }
        if (filters.brands?.length) {
          filters.brands.forEach((brandId) => queryParams.append('brands', brandId));
        }
        if (filters.sizes?.length) {
          filters.sizes.forEach((size) => queryParams.append('sizes', size));
        }
        if (filters.collections?.length) {
          filters.collections.forEach((collection) => queryParams.append('collections', collection));
        }

        // Handle slugs or activeTag
        if (filters.slugs?.length) {
          filters.slugs.forEach((tag) => queryParams.append('slugs', tag));
        } else {
          const activeTag = get().activeTag;
          if (activeTag) {
            queryParams.append('slug', activeTag);
          }
        }

        if (filters.minPrice !== null && filters.minPrice !== undefined) {
          queryParams.set('minPrice', filters.minPrice);
        }
        if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
          queryParams.set('maxPrice', filters.maxPrice);
        }
        if (filters.availability?.available) {
          queryParams.set('available', 'true');
        }
        if (filters.availability?.soldOut) {
          queryParams.set('soldOut', 'true');
        }
        if (filters.page) queryParams.set('page', filters.page);
        if (filters.limit) queryParams.set('limit', filters.limit);
        if (filters.search) {
          queryParams.set('search', filters.search);
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/customerproducts/filter?${queryParams.toString()}&t=${Date.now()}`;
        // console.log('🔍 Fetching products from:', url);
        const res = await fetch(url, {
          signal, // AbortController signal for canceling requests
          cache: 'no-store',
          headers: {},
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        // console.log('📥 Products response:', JSON.stringify(json, null, 2));

        if (json.statusCode === 200 || json.message?.includes('retrieved successfully')) {
          const products = json.data?.products || json.data?.relatedProducts || [];
          const totalPages = json.data?.pagination?.totalPages || 1;

          set((state) => ({
            ...state,
            products: Array.isArray(products) ? products : [],
            totalPages: Math.max(totalPages, 1),
            loading: false,
          }));
        } else {
          throw new Error(json.message || 'Failed to fetch products');
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          set({ error: err.message, loading: false });
          console.error('❌ Error in fetchProductsByFilters:', err.message);
        }
      }
    },

    setActiveFilters: (filters) => {
      set((state) => ({
        ...state,
        activeFilters: { ...state.activeFilters, ...filters },
      }));
    },

    setActiveTag: (tag) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('activeTag', tag);
      }
      set((state) => ({
        ...state,
        activeTag: tag,
        activeFilters: { ...state.activeFilters, tags: [tag] },
      }));
    },

    setSearchQuery: (search) => {
      set((state) => ({
        ...state,
        activeFilters: { ...state.activeFilters, search },
      }));
    },

    resetFilters: () => {
      const resetTag = typeof window !== 'undefined'
        ? localStorage.getItem('activeTag') || 'womens-fashion'
        : 'womens-fashion';
      set({
        activeFilters: {
          tags: [resetTag],
          colors: [],
          brands: [],
          sizes: [],
          collections: [],
          minPrice: null,
          maxPrice: null,
          availability: {},
          search: '',
        },
        activeTag: resetTag,
      });
    },

    updateFilter: (filterType, value, isAdd = true) => {
      const currentFilters = get().activeFilters;
      const newFilters = { ...currentFilters };

      if (filterType === 'price') {
        let min, max;
        if (typeof value === 'string') {
          [min, max] = value.replace(/₹/g, '').split('–').map(Number);
        } else if (value && typeof value === 'object' && 'min' in value && 'max' in value) {
          min = value.min;
          max = value.max;
        } else {
          throw new Error('Invalid price filter value');
        }
        newFilters.minPrice = min;
        newFilters.maxPrice = max;
        newFilters.priceRange = [min, max];
        newFilters.price = `₹${min}–₹${max}`;
      } else if (filterType === 'availability') {
        newFilters.availability = newFilters.availability || {};
        newFilters.availability[value] = isAdd;
        if (!isAdd) {
          delete newFilters.availability[value];
        }
        if (Object.keys(newFilters.availability).length === 0) {
          delete newFilters.availability;
        }
      } else {
        const pluralType = filterType + 's';
        if (!newFilters[pluralType]) {
          newFilters[pluralType] = [];
        }
        if (isAdd) {
          if (!newFilters[pluralType].includes(value)) {
            newFilters[pluralType].push(value);
          }
        } else {
          newFilters[pluralType] = newFilters[pluralType].filter((item) => item !== value);
        }
        if (newFilters[pluralType].length === 0) {
          delete newFilters[pluralType];
        }
      }

      set({ activeFilters: newFilters });
      return newFilters;
    },
  };
});

export default useFilter;