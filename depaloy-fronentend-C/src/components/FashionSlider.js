"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { volkhov } from "../lib/fonts";
import useDealsStore from "../store/useDealsStore";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
// import { useRouter } from "next/navigation'";
import { useRouter } from "next/navigation";
const FALLBACK_IMAGE = "/images/D-img.jpg";

export default function FashionSlider() {
  const [startIndex, setStartIndex] = useState(0);
  const [filter, setFilter] = useState("all");
  const { products, loading, error, fetchDeals } = useDealsStore();
  const router = useRouter();
// console.log(".......",products);

  const logos = [
    { src: "/logo/logo (1).png", alt: "Logo 1" },
    { src: "/logo/logo (2).png", alt: "Logo 2" },
    { src: "/logo/logo (3).png", alt: "Logo 3" },
    { src: "/logo/logo (4).png", alt: "Logo 4" },
    { src: "/logo/logo.png", alt: "Logo 5" },
  ];

  // Validate image URL
  const getImageUrl = (card) => {
    const imageUrl = card?.images?.url;
    if (!imageUrl) {
      console.warn("Missing image URL for card:", card?.name);
      return FALLBACK_IMAGE;
    }
    try {
      const fullUrl = new URL(imageUrl);
      return fullUrl.toString();
    } catch (e) {
      console.error("Invalid URL:", imageUrl, e);
      return FALLBACK_IMAGE;
    }
  };

  // Fetch deals on mount
  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const rotateRight = () => {
    if (!Array.isArray(products) || products.length === 0) return;
    setStartIndex((prev) => (prev + 1) % products.length);
  };

  const rotateLeft = () => {
    if (!Array.isArray(products) || products.length === 0) return;
    setStartIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const getVisibleCards = () => {
    if (!Array.isArray(products) || products.length === 0) return [];
    let filteredProducts = products;
    if (filter !== "all") {
      filteredProducts = products
        .filter((card) => {
          const discountNum = parseInt(card.discount) || 0;
          return filter === "high" ? discountNum >= 50 : discountNum >= 30;
        })
        .sort((a, b) => parseInt(b.discount) - parseInt(a.discount));
    }
    const visible = [];
    for (let i = 0; i < Math.min(3, filteredProducts.length); i++) {
      visible.push(filteredProducts[(startIndex + i) % filteredProducts.length]);
    }
    return visible;
  };

  if (loading) {
    return <div className="text-center py-10">Loading deals...</div>;
  }

 if (error) {
  toast.error(`❌ Error: ${error}`);
  // return null; // Don't render anything
}

  if (!Array.isArray(products) || products.length === 0) {
    return <div className="text-center py-10">No deals available</div>;
  }

  const visibleCards = getVisibleCards();

  return (
    <div className="w-full componet2_bg py-6 sm:py-8 lg:py-12 px-2 sm:px-4 relative">
      <div className="max-w-[1281px] mx-auto relative">
        {/* Filter for Hottest Collections */}
        <div className="mb-4 flex justify-center">
          {/* <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setStartIndex(0);
              toast.info(`Filtering by ${e.target.value === "all" ? "all deals" : e.target.value === "high" ? "50%+ off" : e.target.value === "medium" ? "30%+ off" : ""}`);
            }}
            className="p-2 border rounded bg-white text-gray-800"
          >
            <option value="all">All Deals</option>
            <option value="high">Hottest (50%+ Off)</option>
            <option value="medium">Great Deals (30%+ Off)</option>
          </select> */}
        </div>

        {/* Mobile and Tablet Layout */}
        <div className="block lg:hidden flex flex-col">
          {/* Deal Card - Mobile/Tablet */}
          <div className="p-4 sm:p-6 mb-6 sm:mb-8 mr-auto max-w-md tablet-deals-card">
            <h2
              className={`text-[27px] sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 ${volkhov.className}`}
            >
              Deals Of The Month
            </h2>
            <div className="space-y-1 mb-4 text-sm sm:text-base">
              <p className="text-gray-600">Unbeatable prices, limited offer!</p>
              <p className="text-gray-600">Grab the hottest deals before theyre gone.</p>
              <p className="text-gray-600">Shop now and save big this month</p>
            </div>
            <Link href="/fashion">
              <button
                className="bg-yellow-400 cursor-pointer hover:bg-yellow-500 text-black text-[16px] font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow hover:shadow-md transform hover:scale-105"
                onClick={() => toast.success("Redirecting to deals page!")}
              >
                Buy Now
              </button>
            </Link>
          </div>

          {/* Cards Container - Mobile (3 cards) */}
           <div className="block sm:hidden w-full mb-6">
      <div className="flex gap-3 justify-center px-3">
        {visibleCards.map((card, index) => (
          <div
            key={card.id || `${card.title}-${index}`}
            onClick={() => router.push(`/fashion/${card._id}`)} // ✅ Add navigation here
            className="relative flex-shrink-0 overflow-hidden bg-[#f9f9f9] rounded-none hover:shadow-xl transition-transform duration-300 cursor-pointer"
            style={{
              width: index === 0 ? "160px" : "25vw",
              maxWidth: index === 0 ? "110px" : "90px",
              minWidth: index === 0 ? "90px" : "80px",
              height: index === 0 ? "190px" : "165px",
              aspectRatio: "3/4",
            }}
          >
            <Image
              src={getImageUrl(card)}
              alt={card.title || "Deal Image"}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 30vw, 25vw"
              priority={index === 0}
              onError={() => {
                console.error("Image failed to load for card:", card.title);
                toast.error(`Failed to load image for ${card.title}`);
              }}
            />
            {index === 0 && (
              <div className="absolute bottom-1 left-1 bg-white p-1 shadow-md rounded">
                <p className="text-[8px] text-gray-700">{`${card.name}`}</p>
                <h2 className="text-[9px] font-bold text-black">{card.discount}% OFF</h2>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

          {/* Cards Container - Tablet (3 cards) */}
          <div className="hidden sm:block lg:hidden w-full mb-6">
  <div className="flex gap-3 justify-center px-3">
    {visibleCards.map((card, index) => (
      <div
        key={card.id || `${card.title}-${index}`}
        onClick={() => router.push(`/fashion/${card._id}`)} // ✅ Add navigation
        className="relative flex-shrink-0 overflow-hidden bg-[#f9f9f9] rounded-none hover:shadow-xl transition-transform duration-300 cursor-pointer"
        style={{
          width: index === 0 ? "28vw" : "24vw",
          maxWidth: index === 0 ? "180px" : "160px",
          minWidth: index === 0 ? "130px" : "110px",
          height: index === 0 ? "340px" : "280px",
          aspectRatio: "3/4",
        }}
      >
        <Image
          src={getImageUrl(card)}
          alt={card.title || "Deal Image"}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 28vw, 24vw"
          priority={index === 0}
          onError={() => {
            console.error("Image failed to load for card:", card.title);
            toast.error(`Failed to load image for ${card.title}`);
          }}
        />
        {index === 0 && (
          <div className="absolute bottom-2 left-2 bg-white p-2 shadow-md rounded">
            <p className="text-xs text-gray-700">{`${card.name}`}</p>
            <h2 className="text-sm font-bold text-black">{card.discount}% OFF </h2>
          </div>
        )}
      </div>
    ))}
  </div>
</div>

          {/* Navigation Buttons - Mobile/Tablet */}
          <div className="flex justify-center gap-3 mb-4">
            <button
              onClick={rotateLeft}
              className="bg-white text-black shadow-lg rounded-full w-6 h-6 sm:w-11 sm:h-11 hover:bg-gray-800 transition-colors flex items-center justify-center"
              aria-label="Previous"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={rotateRight}
              className="bg-white text-black shadow-lg rounded-full w-6 h-6 sm:w-11 sm:h-11 hover:bg-gray-800 transition-colors flex items-center justify-center"
              aria-label="Next"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-start justify-between gap-3 px-1 overflow-visible desktop-container">
          {/* Deal Card - Desktop */}
          <div className="relative max-w-[444px] w-full h-[253px] mx-auto text-start deals-card">
            <div className="p-3 mt-2 relative h-full overflow-hidden">
              <h2
                className={`text-[27px] font-bold text-gray-800 mb-2 ${volkhov.className}`}
              >
                Deals Of The Month
              </h2>
              <div className="space-y-1 mb-3 text-[14px]">
                <p className="text-gray-600 ">Unbeatable prices, limited offer!</p>
                <p className="text-gray-600">Grab the hottest deals before theyre gone.</p>
                <p className="text-gray-600">Shop now and save big this month</p>
              </div>
              {/* <Link href="/fashion">
                <button
                  className="w-[180px] h-[56px] bg-yellow-400 cursor-pointer hover:bg-yellow-500 text-black text-[16px] font-semibold py-2 px-1 rounded-lg transition-all duration-200 shadow hover:shadow-md transform hover:scale-105"
                  onClick={() => toast.success("Redirecting to deals page!")}
                >
                  Buy Now
                </button>
              </Link> */}
            </div>
          </div>

          {/* Navigation Buttons - Desktop */}
          <div className="absolute left-[220px] bottom-6 flex gap-2 z-20 nav-buttons">
            <button
              onClick={rotateLeft}
              className="bg-white text-black cursor-pointer text-Center h-8 w-8 shadow-xl rounded-full  hover:shadow-xl hover: transition-colors text-xl"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600 ml-1 " />
            </button>
            <button
              onClick={rotateRight}
              className="bg-white text-black h-8 w-8 shadow-xl cursor-pointer rounded-full  hover:shadow-xl transition-colors text-xl"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600 ml-1" />
            </button>
          </div>

          {/* Card Group - Desktop */}
            <div className="flex gap-3">
      {visibleCards.map((card, index) => (
        <div
          key={card.id || `${card.title}-${index}`}
          onClick={() => router.push(`/fashion/${card._id}`)} // ✅ Add this
          className={`relative cursor-pointer flex-shrink-0 overflow-hidden bg-[#f9f9f9] rounded-none hover:shadow-xl transition-transform duration-300 custom-card ${index === 0 ? 'primary' : 'secondary'}`}
          style={{
            width: index === 0 ? "360px" : "270px",
            height: index === 0 ? "482px" : "420px",
            aspectRatio: "3/4",
            alignSelf: "flex-start",
          }}
        >
          <Image
            src={getImageUrl(card)}
            alt={card.title || "Deal Image"}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 24vw, 280px"
            priority={index === 0}
            onError={() => {
              console.error("Image failed to load for card:", card.title);
              toast.error(`Failed to load image for ${card.title}`);
            }}
          />
          {index === 0 && (
            <div className="absolute bottom-4 left-4 bg-white p-3 shadow-md rounded">
              <p className="text-xs text-gray-700">{`${card.name}`}</p>
              <h2 className="text-base font-bold text-black">{card.discount}% OFF</h2>
            </div>
          )}
        </div>
      ))}
    </div>


        </div>

        {/* Fixed Dots Indicator */}
        {/* <div className="flex justify-center mt-2 lg:mt-[-20px] gap-2 relative z-10 lg:ml-60">
  {products.map((card, index) => (
    <div
      key={card.id || `${card.title}-${index}`}
      onClick={() => setStartIndex(index)}
      aria-label={`Go to slide ${index + 1}`}
      className="cursor-pointer flex items-center justify-center"
    >
      {startIndex === index ? (
        // ✅ Active dot: black center inside white ring with border
        <div className="h-5 w-5 rounded-full border-2 border-gray-600 bg-white flex items-center justify-center">
          <div className="h-3 w-3 rounded-full bg-black" />
        </div>
      ) : (
        // ❌ Inactive dot: gray circle only
        <div className="h-2 w-2 rounded-full bg-gray-400" />
      )}
    </div>
  ))}
</div> */}


      </div>
      {/* //////////// all logo */}

      <div className="max-w-[1281px] mx-auto p-8 md-mt-7 overflow-hidden pb-8">
        <div className="flex flex-nowrap items-center justify-between gap-4 w-full">
          {logos.map(({ src, alt }) => (
            <div
              key={alt}
              className="relative flex-shrink w-full max-w-[140px] h-[24px] sm:h-[28px] md:h-[33px]"
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 10vw, 140px"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}