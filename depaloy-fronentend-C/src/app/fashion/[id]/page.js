"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";
import useProductDetailStore from "../../../store/useProductDetailStore";
import { Heart, Share2, GitCompare, Star, Truck, Eye, Play } from "lucide-react";
import FashionSlider from "../../../components/FashionSlider";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { volkhov } from "../../../lib/fonts";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const PLACEHOLDER_IMAGE = `${API_BASE_URL}/placeholder.jpg`;

export default function ProductPage() {
  const { id } = useParams();
  const { product, fetchProductById, loading, error } = useProductDetailStore();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentMedia, setCurrentMedia] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 5, seconds: 59 });
  const [pageLoading, setPageLoading] = useState(true);

  // Log product state changes for debugging
  useEffect(() => {
    console.log("Product state updated:", product);
  }, [product]);

  // Timer for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        else if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        else if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Product Fetch
  useEffect(() => {
    if (!id || typeof id !== "string") {
      console.warn("Invalid ID:", id);
      toast.error("Product ID is invalid");
      setPageLoading(false);
      return;
    }

    const controller = new AbortController();
    const fetchTimer = setTimeout(() => {
      fetchProductById(id, controller.signal)
        .then(() => {
          const delayTimer = setTimeout(() => {
            setPageLoading(false);
          }, 500);
          return () => clearTimeout(delayTimer);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error("Fetch Error:", err);
            toast.error(`Failed to load product: ${err.message}`);
            setPageLoading(false);
          }
        });
    }, 300);

    return () => {
      clearTimeout(fetchTimer);
      controller.abort();
    };
  }, [id, fetchProductById]);

  // Default size and color when product loads
  useEffect(() => {
    if (product?.variants?.length > 0) {
      const firstVariant = product.variants[0];
      const newColor = firstVariant.color?.name || "";
      const newSize = firstVariant.sizes?.[0]?.size || "";
      setSelectedColor((prev) => (prev !== newColor ? newColor : prev));
      setSelectedSize((prev) => (prev !== newSize ? newSize : prev));
    }
  }, [product]);

  // Update selected size when color changes
  useEffect(() => {
    if (selectedColor && product?.variants?.length > 0) {
      const selectedVariant = product.variants.find(
        (variant) => variant.color?.name === selectedColor
      );
      const newSize = selectedVariant?.sizes?.[0]?.size || "";
      setSelectedSize(newSize);
    }
  }, [selectedColor, product]);

  // Find the selected variant based on color
  const selectedVariant = product?.variants?.find(
    (variant) => variant.color?.name === selectedColor
  ) || product?.variants?.[0];

  // Get media (images and videos) for the selected variant
  const getMediaItems = () => {
    const images = selectedVariant?.images || [];
    const videos = selectedVariant?.videos || [];

    // Helper function to determine media type based on URL extension
    const getMediaType = (url) => {
      const extension = url.split('.').pop().toLowerCase();
      const videoExtensions = ['mp4', 'webm', 'ogg'];
      return videoExtensions.includes(extension) ? 'video' : 'image';
    };

    // Combine images and videos into a single media array
    const mediaItems = [
      ...images.map(item => ({
        ...item,
        type: item.type || getMediaType(item.url), // Use explicit type if provided, else infer from URL
      })),
      ...videos.map(video => ({ ...video, type: 'video' })),
    ];

    // If no media items, return placeholder
    if (mediaItems.length === 0) {
      return [
        {
          url: "/placeholder.jpg",
          alt: "Placeholder",
          isPrimary: true,
          _id: "placeholder",
          type: 'image',
        },
      ];
    }

    return mediaItems;
  };

  const mediaItems = getMediaItems();
  const primaryMediaIndex = mediaItems.findIndex((item) => item.isPrimary) !== -1
    ? mediaItems.findIndex((item) => item.isPrimary)
    : 0;

  // Get price for the selected variant
  const currentPrice = selectedVariant?.price || product?.finalPrice || 0;

  // Reset currentMedia when selectedColor changes
  useEffect(() => {
    setCurrentMedia(primaryMediaIndex);
  }, [selectedColor, primaryMediaIndex]);

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: document.title || "Check this out!",
      text: "Check this out!",
      url: window.location.href || window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareData.url);
          alert("Link copied to clipboard!");
        } else {
          alert("Sharing and clipboard not supported. Please copy the link manually: " + shareData.url);
        }
      }
    } catch (err) {
      console.error("Share failed:", err.message, "Share Data:", shareData);
      alert("Sharing failed. Please try copying the link manually: " + shareData.url);
    }
  };

  // Loading and error states
  if (pageLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-center items-center min-h-[500px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <p className="text-center">Product not found</p>;

  const colors = product.variants?.map((variant) => ({
    name: variant.color?.name || "Unknown",
    hex: variant.color?.hex || "#000000",
    id: variant.color?.id || variant._id,
  })) || [];
  const sizes = selectedVariant?.sizes || [];
  const roundedRating = Math.round(selectedVariant?.rating || 0);

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 bg-white">
        <div className="mt-2 my-5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/fashion">Fashion</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT MEDIA (IMAGES & VIDEOS) */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div
              className="mt-2 hidden lg:flex flex-col space-y-2 overflow-y-scroll max-h-[684px] w-19"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitScrollbar: "none",
              }}
            >
              {mediaItems.map((item, index) => (
                <button
                  key={`${item._id}-${index}`}
                  onClick={() => setCurrentMedia(index)}
                  className={`w-16 h-20 border-2 cursor-pointer flex-shrink-0 relative ${currentMedia === index ? "border-blue-500" : "border-gray-200"
                    } overflow-hidden rounded hover:border-blue-300 transition-colors`}
                >
                  {item.type === 'video' ? (
                    <>
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    </>
                  ) : (
                    <img
                      src={`${item.url}`}
                      alt={item.alt || `Thumbnail ${index}`}
                      className="w-full h-full object-cover"
                      onError={() => console.error("Image load failed:", item.url)}
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="p-2 relative w-full max-w-md mx-auto lg:max-w-full">
              <div className="relative w-full aspect-[4/4] overflow-hidden rounded">
                {mediaItems[currentMedia] && (
                  <>
                    {mediaItems[currentMedia].type === 'video' ? (
                      <video
                        src={`${mediaItems[currentMedia].url}`}
                        className="w-full h-full object-contain rounded"
                        controls
                        autoPlay
                         muted
      
                        preload="metadata"
                        // poster={mediaItems[currentMedia].thumbnail || "/placeholder.jpg"}
                      />
                    ) : (
                      <img
                        src={`${mediaItems[currentMedia].url}`}
                        alt={mediaItems[currentMedia].alt || product.name}
                        className="w-full h-full object-fit object-contain rounded"
                      />
                    )}
                  </>
                )}
              </div>
              <div className="lg:hidden flex space-x-2 overflow-x-auto mt-3">
                {mediaItems.map((item, index) => (
                  <button
                    key={`${item._id}-${index}`}
                    onClick={() => setCurrentMedia(index)}
                    className={`flex-shrink-0 w-16 h-20 border-2 relative ${currentMedia === index ? "border-blue-500" : "border-gray-300"
                      } overflow-hidden rounded`}
                  >
                    {item.type === 'video' ? (
                      <>
                        <video
                          src={item.url}
                          className="w-full h-full object-center"
                          muted
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <Play className="w-3 h-3 text-white" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={`${item.url}`}
                        alt={item.alt || `View ${index}`}
                        className="w-full h-full object-center"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* RIGHT PRODUCT DETAILS */}
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className={`${volkhov.className} text-3xl font-bold text-gray-900`}>{product.name}</h1>
                <div className="flex items-center mt-1">
                  <div className="flex text-yellow-400">
                    {[...Array(roundedRating)].map((_, i) => (
                      <Star key={`star-${i}`} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">{roundedRating}</span>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 cursor-pointer px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 w-[52px] md:w-auto"
              >
                <Share2 className="w-4 h-4 text-black" />
              </button>
            </div>
            <div className="flex flex-col items-start space-y-1">
              <span className="text-3xl font-bold text-gray-900">₹{selectedVariant.finalPrice}</span>
              <div className="flex items-center space-x-2">
                <span className="text-xl text-gray-500 line-through">
                  ₹{(currentPrice).toFixed(0)}
                </span>
                <span className="bg-red-500 text-white px-1 py-1 text-sm font-bold rounded">
                  {selectedVariant.discount}% OFF
                </span>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Eye className="w-4 h-4 mr-1" /> {product.viewCount} people are viewing this
            </div>
            {/* SIZE OPTIONS */}
            <div className="w-fit">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Size: {selectedSize || "None"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {sizes.length > 0 ? (
                  sizes.map((sizeObj) => (
                    <button
                      key={`size-${sizeObj._id}`}
                      onClick={() => setSelectedSize(sizeObj.size)}
                      className={`
                        min-w-[36px] px-1 py-1 border rounded-sm font-semibold text-xs sm:text-sm
                        transition-all duration-200 
                        ${selectedSize === sizeObj.size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                        }
                      `}
                    >
                      {sizeObj.size}
                    </button>
                  ))
                ) : (
                  <p>No sizes available</p>
                )}
              </div>
            </div>

            {/* COLOR OPTIONS */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Color: {selectedColor || "None"}
              </label>
              <div className="flex flex-wrap gap-3 max-w-[270px]">
                {colors.map((color, index) => (
                  <button
                    key={`color-${color.id || index}`}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 cursor-pointer
                      ${selectedColor === color.name ? "border-black ring-2 ring-black" : "border-gray-300"}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            {/* QUANTITY + CART */}
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0 text-gray-700">
              <button
                onClick={() => {
                  const productURL = window.location.href;
                  const message = `Hi, I want to buy this product:

🛍️ *Name:* ${product.name}
🔗 *Link:* ${productURL}
💰 *Price:* ₹${selectedVariant.finalPrice }
📏 *Size:* ${selectedSize || "Not selected yet"}
🎨 *Color:* ${selectedColor || "Not selected yet"}
🧮 *Quantity:* ${quantity}`;

                  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER;
                  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                  window.open(whatsappURL, "_blank");
                }}
                className="flex items-center justify-center text-center cursor-pointer gap-1 px-5 py-2 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600 max-w-xs w-full"
              >
                <FaWhatsapp />
                Buy Now
              </button>
            </div>
          </div>
        </div>
        {(product.description || product.specifications?.fit || product.specifications?.material) && (
          <div className="border p-4 mt-8 space-y-1">
            {product.description && (
              <div className="">
                <h2 className={`${volkhov.className} text-[29px] font-semibold text-gray-800 mb-2 border-b ml-4`}>Description</h2>

                {product.specifications?.fit && (
                  <div className="flex ml-4">
                    <h2 className="text-lg font-semibold text-gray-800  pr-1  ">Fit:</h2>
                    <div className="whitespace-pre-line leading-relaxed  text-gray-600 ">{product.specifications.fit}</div>
                  </div>
                )}

                {product.specifications?.material && (
                  <div className="flex ml-4">
                    <h2 className="text-lg font-semibold text-gray-800 pr-1 ">Material: </h2>
                    <div className="whitespace-pre-line leading-relaxed  text-gray-600">{product.specifications.material}</div>
                  </div>
                )}
                <p className="whitespace-pre-line leading-relaxed   text-gray-600 pr-4 ml-4">{product.description}</p>
              </div>
            )}
          </div>
        )}
      </div>
      <FashionSlider />
    </>
  );
}