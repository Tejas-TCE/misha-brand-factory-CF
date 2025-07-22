import { create } from "zustand";

const useFilter = create((set, get) => {
  const savedTag = typeof window !== "undefined"
    ? localStorage.getItem("activeTag") || ""
    : "";

  return {
    products: [],
    colors: [],
    colorMap: [],
    brandMap: [],
    sizes: [],
    tags: [],
    collections: [],

    activeTag: savedTag,
    activeFilters: { tag: savedTag },

    loading: false,
    error: null,

    fetchFilterOptions: async (tag = savedTag) => {
      set({ loading: true, error: null });
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}${GET_ALLFILTERS_URL}?tags=${tag}`,
          { cache: "no-store" } // Ensure fresh data in Next.js
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();

        if (json.statusCode === 200) {
          const { colors, brands, sizes, tags } = json.data;

          set({
            colorMap: colors || [],
            brandMap: brands || [],
            sizes: sizes ? sizes.map((s) => s.symbol) : [],
            tags: tags ? tags.map((t) => t.name) : [],
            loading: false,
          });

          // Log state after update
          // console.log(
          //   "Filter options fetched:",
          //   get().colorMap,
          //   get().brandMap,
          //   get().sizes,
          //   get().tags
          // );
        } else {
          throw new Error(json.message || "Failed to fetch filter options");
        }
      } catch (err) {
        set({ error: err.message, loading: false });
        console.error("Error in fetchFilterOptions:", err.message);
      }
    },

    fetchProductsByFilters: async (filters = {}) => {
      set({ loading: true, error: null });
      try {
        // Placeholder for product fetching logic
        // console.log("Fetching products with filters:", filters);
        // Example API call (uncomment and customize as needed):
        /*
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/customerproducts?${new URLSearchParams(filters)}`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        if (json.statusCode === 200) {
          set({ products: json.data, loading: false });
        } else {
          throw new Error(json.message || "Failed to fetch products");
        }
        */
        set({ loading: false });
      } catch (err) {
        set({ error: err.message, loading: false });
        console.error("Error in fetchProductsByFilters:", err.message);
      }
    },

    setActiveFilters: (filters) => set({ activeFilters: filters }),

    setActiveTag: (tag) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("activeTag", tag);
      }
      set({ activeTag: tag });
    },

    resetFilters: () => {
      const resetTag = typeof window !== "undefined"
        ? localStorage.getItem("activeTag") || ""
        : "";
      set({
        activeFilters: { tag: resetTag },
        activeTag: resetTag,
      });
    },
  };
});

export default useFilter;