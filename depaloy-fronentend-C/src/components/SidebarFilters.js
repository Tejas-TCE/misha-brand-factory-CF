'use client';

import { useState, useEffect } from 'react';
import useFilter from '../store/useProductFilterStore';
import { Range as ReactRange } from 'react-range';
import { toast } from 'react-toastify';

export default function SidebarFilters() {
  const {
    activeTag,
    activeFilters,
    fetchProductsByFilters,
    setActiveFilters,
    setActiveTag,
    resetFilters,
    error,
    loading,
  } = useFilter();

  const [selectedPrice, setSelectedPrice] = useState(activeFilters.price || null);
  const [pageLoading, setPageLoading] = useState(true);
  const [tempPriceRange, setTempPriceRange] = useState(activeFilters.priceRange || [0, 50000]);

  useEffect(() => {
    const controller = new AbortController();
    const savedTag = localStorage.getItem('activeTag') || '';
    setActiveTag(savedTag);
    setActiveFilters({ tags: [savedTag] });
    fetchProductsByFilters({ tags: [savedTag] }, controller.signal);

    const timer = setTimeout(() => setPageLoading(false), 1000);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [setActiveTag, setActiveFilters, fetchProductsByFilters]);

  useEffect(() => {
    setSelectedPrice(activeFilters.price || null);
    setTempPriceRange(activeFilters.priceRange || [0, 50000]);
  }, [activeFilters.price, activeFilters.priceRange]);

  const handleClearFilters = () => {
    resetFilters();
    setSelectedPrice(null);
    setTempPriceRange([0, 50000]);
    const savedTag = localStorage.getItem('activeTag') || '';
    fetchProductsByFilters({ tags: [savedTag] });
  };

  const handleFilterClick = (filterType, value) => {
    const newFilters = { ...activeFilters };

    if (filterType === 'price') {
      const { min, max } = value;
      newFilters.minPrice = min;
      newFilters.maxPrice = max;
      newFilters.priceRange = [min, max];
      newFilters.price = `₹${min}–₹${max}`;
      setSelectedPrice(newFilters.price);
    } else if (filterType === 'availability') {
      newFilters.availability = newFilters.availability || {};
      newFilters.availability[value] = !newFilters.availability[value];
      if (!newFilters.availability[value]) {
        delete newFilters.availability[value];
      }
      if (Object.keys(newFilters.availability).length === 0) {
        delete newFilters.availability;
      }
    } else {
      const pluralFilterType = filterType + 's';
      newFilters[pluralFilterType] = Array.isArray(newFilters[pluralFilterType])
        ? newFilters[pluralFilterType]
        : [];
      if (newFilters[pluralFilterType].includes(value)) {
        newFilters[pluralFilterType] = newFilters[pluralFilterType].filter((item) => item !== value);
      } else {
        newFilters[pluralFilterType].push(value);
      }
      if (newFilters[pluralFilterType].length === 0) {
        delete newFilters[pluralFilterType];
      }
    }

    if (filterType === 'tag') {
      localStorage.setItem('activeTag', value);
      setActiveTag(value);
      newFilters.tags = [value];
    }

    setActiveFilters(newFilters);

    if (filterType !== 'price') {
      fetchProductsByFilters(newFilters);
    }
  };

  const handlePriceRangeFinalChange = (values) => {
    const newFilters = { ...activeFilters };
    const min = values[0];
    const max = values[1];
    newFilters.minPrice = min;
    newFilters.maxPrice = max;
    newFilters.priceRange = [min, max];
    newFilters.price = `₹${min}–₹${max}`;
    setSelectedPrice(newFilters.price);
    setActiveFilters(newFilters);
    fetchProductsByFilters(newFilters);
  };
  // Show error using toast
  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

  return (
    <div className="p-4 w-full max-w-xs bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
        <button
          onClick={handleClearFilters}
          className="text-sm font-semibold cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-xl transition-colors"
          disabled={
            !Object.keys(activeFilters).some(
              (key) => key !== 'tags' && activeFilters[key]?.length || activeFilters[key]
            )
          }
        >
          Clear All
        </button>
      </div>

      {/* Price Filter */}
      <FilterSection title="Price">
        <div className="flex flex-col gap-4">
          <div className="price-range-slider">
            <ReactRange
              step={10}
              min={0}
              max={50000}
              values={tempPriceRange}
              onChange={(values) => {
                setTempPriceRange(values);
                handleFilterClick('price', { min: values[0], max: values[1] });
              }}
              onFinalChange={handlePriceRangeFinalChange}
              renderTrack={({ props, children }) => {
                const [minVal, maxVal] = tempPriceRange;
                const left = ((minVal / 50000) * 100).toFixed(2);
                const right = ((maxVal / 50000) * 100).toFixed(2);

                return (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: '4px',
                      borderRadius: '2px',
                      background: `linear-gradient(to right,
                        #e5e7eb 0%,
                        #e5e7eb ${left}%,
                        #FDC015 ${left}%,
                        #FDC015 ${right}%,
                        #e5e7eb ${right}%,
                        #e5e7eb 100%)`,
                    }}
                  >
                    {children}
                  </div>
                );
              }}
              renderThumb={({ props, index }) => {
                const { key, ...rest } = props;
                return (
                  <div
                    key={key}
                    {...rest}
                    style={{
                      ...rest.style,
                      height: '18px',
                      width: '18px',
                      background: '#FDC015',
                      border: '2px solid #fff',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    aria-label={index === 0 ? 'Minimum price' : 'Maximum price'}
                    aria-valuemin={0}
                    aria-valuemax={50000}
                    aria-valuenow={tempPriceRange[index]}
                  />
                );
              }}
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>₹{tempPriceRange[0]}</span>
              <span>₹{tempPriceRange[1]}</span>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Availability Filter */}
      <FilterSection title="Availability">
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={activeFilters.availability?.soldOut || false}
              onChange={() => handleFilterClick('availability', 'soldOut')}
              className="h-4 w-4 cursor-pointer"
            />
            Sold Out
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={activeFilters.availability?.available || false}
              onChange={() => handleFilterClick('availability', 'available')}
              className="h-4 w-4 cursor-pointer"
            />
            Available
          </label>
        </div>
      </FilterSection>
    </div>
  );
}

function FilterSection({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      {children}
    </div>
  );
}
