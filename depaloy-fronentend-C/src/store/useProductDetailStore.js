import { create } from "zustand";
import { GET } from "../lib/api_helapr";
import { GET_PRODECT_detail_URL } from "../lib/url_helapr";

const useProductDetailStore = create((set) => ({
  product: null,
  loading: false,
  error: null,

  fetchProductById: async (id, signal) => {
    console.log("Fetching product with ID:", id); // Debug log
    set({ loading: true, error: null });
    try {
      const res = await GET(`${process.env.NEXT_PUBLIC_API_URL}${GET_PRODECT_detail_URL}${id}`, { signal });
      console.log("API Response:", res); // Debug log
      set({ product: res.data, loading: false });
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("API Error:", err);
        set({ error: err.message, loading: false });
      }
    }
  },
}));

export default useProductDetailStore;