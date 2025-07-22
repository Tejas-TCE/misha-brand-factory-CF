'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { volkhov } from '../lib/fonts';
import { useCategoryStore } from '../store/categoryStore';

const CategoriesSection = () => {
  const router = useRouter();
  const { categories, loading, error, fetchUsedCategories } = useCategoryStore();

  useEffect(() => {
    fetchUsedCategories();
  }, []);

  const handleClick = (slug) => {
    if (slug) {
      localStorage.setItem('activeTag', slug);
      router.push('/fashion');
    }
  };

  if (loading) return <p className="text-center">Loading categories...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="py-10 px-4 max-w-[1200px] mx-auto">
      <h2 className={`${volkhov.className} text-2xl sm:text-3xl font-bold text-center mb-8 text-black`}>
        Categories
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded relative cursor-pointer hover:shadow-2xl hover:z-10 transform transition duration-300"
            onClick={() => handleClick(cat.slug)}
          >
            <div className="relative w-full min-h-[160px]">
              <Image
                src={cat.bannerImage || '/images/D-img.jpg'}
                alt={cat.name}
                fill
                className="object-contain rounded-t"
              />
              <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center opacity-45 transition-opacity duration-300" />
            </div>

            <div className="bg-[#FDC015] text-black text-center py-2 font-semibold text-sm">
              {cat.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection;
