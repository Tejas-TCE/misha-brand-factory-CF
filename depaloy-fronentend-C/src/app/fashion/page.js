"use client";
import { useState, useEffect, useRef } from "react";
import ProductCard from "../../components/ProductCard";
import SidebarFilters from "../../components/SidebarFilters";
import FollowUsOnInstagram from "../../components/onInstagram";
import { volkhov } from "../../lib/fonts";
import { MdClose } from "react-icons/md";
import { BsSliders } from "react-icons/bs";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Fashionpage() {
  const [isMobileFilterVisible, setIsMobileFilterVisible] = useState(false);
  const [isSortDropdownVisible, setIsSortDropdownVisible] = useState(false);
  const [sortOption, setSortOption] = useState("default");
  const filterRef = useRef(null);
  const sortRef = useRef(null);

  // Click-outside handler for filter dropdown
  useEffect(() => {
    const handleClickOutsideFilter = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        !event.target.closest("button")
      ) {
        setIsMobileFilterVisible(false);
      }
    };

    if (isMobileFilterVisible) {
      document.addEventListener("mousedown", handleClickOutsideFilter);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideFilter);
    };
  }, [isMobileFilterVisible]);

  // Click-outside handler for sort dropdown
  useEffect(() => {
    const handleClickOutsideSort = (event) => {
      if (
        sortRef.current &&
        !sortRef.current.contains(event.target) &&
        !event.target.closest("button")
      ) {
        setIsSortDropdownVisible(false);
      }
    };

    if (isSortDropdownVisible) {
      document.addEventListener("mousedown", handleClickOutsideSort);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSort);
    };
  }, [isSortDropdownVisible]);

  // Sorting options
  const sortOptions = [
    { label: "Default", value: "default" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Name: A-Z", value: "name-asc" },
    { label: "Name: Z-A", value: "name-desc" },
  ];


  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      // lg: breakpoint ke baad mobile filter hide kar do
      setIsMobileFilterVisible(false);
    }
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);


  return (
    <main className="min-h-screen bg-white text-black relative">
      {/* Header */}
      <div className="relative px-4 py-4 bg-white z-30">
        {/* Sort Button - Mobile Only (Left) */}
        {/* <div className="lg:hidden absolute left-4 top-1/2 transform -translate-y-1/2">
          <button
            onClick={() => setIsSortDropdownVisible(!isSortDropdownVisible)}
            className="p-2 rounded text-black flex items-center justify-center"
            aria-label="Sort Options"
          >
            <BsSliders className="text-[28px] text-black" />
          </button>
        </div> */}

        {/* Centered Title and Breadcrumb */}
        <div className="flex flex-col items-center">
          <h1 className={`text-4xl font-bold ${volkhov.className} text-center`}>
            Fashion
          </h1>
          <div className="mt-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {/* <BreadcrumbItem>
                  <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                </BreadcrumbItem> */}
                {/* <BreadcrumbSeparator /> */}
                <BreadcrumbItem>
                  <BreadcrumbPage>fashion</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Filter Button - Mobile Only (Right) */}
        {/* <div className="lg:hidden absolute right-4 top-1/2 transform -translate-y-1/2">
          <button
            onClick={() => setIsMobileFilterVisible(!isMobileFilterVisible)}
            className="p-2 rounded text-black flex items-center justify-between"
            aria-label={isMobileFilterVisible ? "Hide Filter" : "Show Filter"}
          >
            {isMobileFilterVisible ? (
              <MdClose className="text-[28px] text-black" />
            ) : (
              <Image src="/Vector.png" alt="Filter" width={24} height={24} />
            )}
          </button>
        </div> */}

        {/* Sort Dropdown */}
        {/* {isSortDropdownVisible && (
          <div className="absolute top-full left-0 w-48 z-50 mt-2">
            <div
              ref={sortRef}
              className="bg-white border rounded shadow-lg p-4 flex flex-col gap-2"
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortOption(option.value);
                    setIsSortDropdownVisible(false);
                  }}
                  className={`text-center text-sm ${
                    sortOption === option.value ? "text-black font-bold" : "text-gray-600"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )} */}

        {/* Mobile Filter Dropdown */}
   {/* {isMobileFilterVisible && window.innerWidth < 1024 && (
  <div className="absolute top-full left-0 z-50 px-5 mt-2">
    <div
      ref={filterRef}
      className="rounded  inline-block min-w-[300px] p-4"
    >
      <SidebarFilters />
    </div>
  </div>
)} */}



      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row max-w-[1400px] mx-auto px-4 py-4 gap-8 relative z-10">
        {/* Sidebar on Desktop */}
        <aside className="hidden lg:block lg:w-1/4 py-4">
          <SidebarFilters />
        </aside>

        {/* Product Cards */}
        <div className="w-full lg:w-3/4">
          <ProductCard sortOption={sortOption} />
        </div>
      </div>

      <FollowUsOnInstagram />
    </main>
  );
}