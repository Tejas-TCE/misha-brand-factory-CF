"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { volkhov } from "../lib/fonts";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import useProductStore from "../store/productarrivals";
import { toast } from "react-toastify";

const FALLBACK_IMAGE = "/images/fallback-product.jpg";

const categories = [
  { id: "mens", label: "Men's Fashion", tag: "mans-fashion" },
  { id: "womens", label: "Women's Fashion", tag: "womans-fashion" },
  { id: "womens-acc", label: "Women Accessories", tag: "woman-accessories" },
  { id: "men-acc", label: "Men Accessories", tag: "mens-accessories" },
  { id: "discount", label: "Discount Deals", tag: "discount-deal" },
];

export default function NewArrivals() {
  const [activeCategory, setActiveCategory] = useState("womens");
  const [displayCount, setDisplayCount] = useState(6);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const { products, loading, error, fetchNewArrivals, setActiveTag } = useProductStore();
  
  const router = useRouter();

  const getTagForCategory = (categoryId) =>
    categories.find((cat) => cat.id === categoryId)?.tag || "womens-fashion";

  useEffect(() => {
    const tag = getTagForCategory(activeCategory);
    setActiveTag(tag);
    const controller = new AbortController();
    fetchNewArrivals(tag, controller.signal);
    return () => controller.abort();
  }, [activeCategory]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setDisplayCount(6);
  };

  const handleViewMore = () => {
    router.push("/fashion");
  };

  const getImageUrl = (product) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const imageUrl = product?.image?.url;
    if (!baseUrl || !imageUrl) return FALLBACK_IMAGE;
    try {
      const fullUrl = new URL(`${imageUrl}`);
      return fullUrl.toString();
    } catch (e) {
      console.error("Invalid URL:", `${baseUrl}${imageUrl}`, e);
      return FALLBACK_IMAGE;
    }
  };

  const safeProducts = Array.isArray(products) ? products : [];
  const displayedProducts = safeProducts.slice(0, displayCount);
  const hasMoreProducts = safeProducts.length > 0;

  return (
    <div className="max-w-[1277px] mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-10 lg:py-12">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10 lg:mb-12">
        <h2 className={`${volkhov.className} text-[30px] sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6`}>
          New Arrivals
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-4xl mx-auto leading-relaxed px-2">
          Discover the freshest additions to our collection in our New Arrivals section! From the latest trends to tretess essentials, weve handpicked the newest styles just for you, Whether Whether youre looking to upgrade your wardrobe, ratrash your space, or find the perfect gift, our latest arrivals have something for everyone, Dont miss out-explore whats new and be the first to ews whats hot this season 
        </p>
      </div>

      {/* Categories */}
      <div className="px-2 mb-8 sm:mb-10 lg:mb-12">
        <div className="flex justify-start sm:justify-center overflow-x-auto gap-2 sm:gap-3 lg:gap-4 py-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`inline-flex items-center px-5 py-2 cursor-pointer rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                activeCategory === category.id
                  ? "bg-yellow-400 text-black shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-center py-16">
          <p className="text-gray-600 mb-4">
            {error.includes("404") || error.includes("Not Found")
              ? "Products not available."
              : error.includes("Network")
              ? "Connection error. Please check your internet."
              : "Something went wrong. Please try again."}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <p className="text-gray-600">Loading products...</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && safeProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:scale-102 hover:shadow-lg cursor-pointer"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              onClick={() => router.push(`/fashion/${product.id}`)}
            >
              <div className="relative h-80 p-4 rounded-xl overflow-hidden items-center  ">
                <Image
                  src={getImageUrl(product)}
                  alt={product.name || "Product Image"}
                  fill
                  className="p-5 object-cover "
                  onError={() => {
                    toast.error(`Failed to load image for ${product.name}`);
                  }}
                />
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {product.name || "Unnamed Product"}
                    </h3>
                    <p className="text-sm text-gray-500">{product.brand || "Unknown Brand"}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xl font-bold text-gray-800">
                        ${product.variants?.[0]?.price?.toFixed(2) || "N/A"}

                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* WhatsApp Button */}
                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const productURL =`${window.location.origin}/fashion/${product.id}`;
                        const message = `Hi, I want to buy this product from *New Arrivals*:\n🛍️ *Name:* ${product.name}\n🔗 *Link:* ${productURL}\n💰 *Price:* ₹${product.base_price?.toFixed(2)}`;
                        const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER;
                        const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                        window.open(whatsappURL, "_blank");
                        // toast.success(`Opened WhatsApp for ${product.name}`);
                      }}
                      className="bg-green-100 hover:bg-green-200 text-green-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <FaWhatsapp />
                      Buy Now
                    </button>
                    <div className="text-xs text-red-500 pt-7 pr-2">
                      {product.status || "In Stock"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Products */}
      {!loading && !error && safeProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-600">No products available for this category.</p>
        </div>
      )}

      {/* View More */}
      {hasMoreProducts && (
        <div className="text-center mt-10">
          <button
            onClick={handleViewMore}
            className="bg-yellow-400 hover:bg-yellow-500 text-black cursor-pointer font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            View More
          </button>
        </div>
      )}
    </div>
  );
}
