// store/productarrivals.js
import { create } from 'zustand';
import { GET } from '../lib/api_helapr';
import { GAT_ARRIVALS_URL } from "../lib/url_helapr";

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,
  activeTag: typeof window !== "undefined" ? localStorage.getItem('activeTag') || 'mens-fashion' : 'mens-fashion',

  setActiveTag: (tag) => {
    set({ activeTag: tag });
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeTag', tag);
    }
  },

  fetchNewArrivals: async (tag, signal) => {
    set({ loading: true, error: null });
    try {
      const response = await GET(GAT_ARRIVALS_URL, {
        params: { tags: tag },
        signal,
      });

const products = Array.isArray(response.data)
  ? response.data.map((item) => ({
      id: item._id,
      name: item.name,
      brand: item.description || 'Unknown Brand',
      base_price: item.base_price,
      status: item.isFeatured ? 'Featured' : 'New Arrival',
      image: item.variants?.[0]?.images?.[0] || null,
      originalPrice: null,
      variants: item.variants || [], 
    }))
  : [];


      set({ products, loading: false, activeTag: tag });
      localStorage.setItem('activeTag', tag);
      return products;
    } catch (err) {
      if (err.message === 'Request canceled') return;
      console.error('❌ fetchNewArrivals failed:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));

export default useProductStore;
