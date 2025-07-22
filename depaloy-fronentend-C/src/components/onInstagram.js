"use client";
import Image from 'next/image';
import { FaInstagram } from 'react-icons/fa';
import { volkhov } from '../lib/fonts';

const FollowUsOnInstagram = () => {
  const images = [
    '/inst_img/image (1).png',
    '/inst_img/image (2).png',
    '/inst_img/image (3).png',
    '/inst_img/image (4).png',
    '/inst_img/image (5).png',
    '/inst_img/image (6).png',
    '/inst_img/image (7).png',
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className={`text-[24px] sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 ${volkhov.className}`}>
            Follow Us On Instagram
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            Stay connected and be the first to see our exclusive deals, behind-the-scenes moments! Join our Instagram family for daily style inspiration, product highlights, and special giveaways. Hit follow & never miss an update — your next favorite find is just a scroll away!
          </p>
        </div>

        {/* Follow Button */}
        <div className="text-center mb-8">
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <FaInstagram size={24} color="#000000" />
            Follow on Instagram
          </a>
        </div>

        {/* Images Grid */}
 <div className="flex gap-0 overflow-x-auto lg:grid lg:grid-cols-7 lg:overflow-visible px-2">
  {images.map((src, index) => (
    <div
      key={index}
      className={`relative flex-shrink-0 w-48 lg:w-auto ${
        index % 2 === 1
          ? 'h-80 sm:h-72 md:h-76 lg:h-80'
          : 'h-68 sm:h-56 md:h-60 lg:h-64 mt-5'
      } overflow-hidden `}
    >
      <Image
        src={src}
        alt={`Instagram post ${index + 1}`}
        fill
        className="object-cover transition-transform duration-500 hover:scale-110"
      />
    </div>
  ))}
</div>


      </div>
    </div>
  );
};

export default FollowUsOnInstagram;