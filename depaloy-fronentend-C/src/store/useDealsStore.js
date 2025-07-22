import { create } from 'zustand';
import { GET } from '../lib/api_helapr'; // Adjust the path to your apiClient
import { GET_SLIDER_URL } from "../lib/url_helapr"

const useDealsStore = create((set) => ({
  products: [], // Changed from cardsData to products
  newArrivals: [], // Added for NewArrivals component
  loading: false,
  error: null,

  // Action to fetch deals
  fetchDeals: async () => {
    set({ loading: true, error: null });
    try {
      const response = await GET(GET_SLIDER_URL);
      // Remove the mapping since we updated the component to use the raw API data
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Action to fetch new arrivals (add your actual API endpoint)
  fetchNewArrivals: async () => {
    set({ loading: true, error: null });
    try {
      // Replace with your actual new arrivals endpoint
      const response = await GET('/api/new-arrivals'); // Update this URL
      set({ newArrivals: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useDealsStore;