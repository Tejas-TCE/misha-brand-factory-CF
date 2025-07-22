"use client";
import Image from "next/image";
import { volkhov } from '../lib/fonts';
import Link from "next/link";


export default function Mainbanner() {
  const logos = [
    { src: "/logo/logo (1).png", alt: "Logo 1" },
    { src: "/logo/logo (2).png", alt: "Logo 2" },
    { src: "/logo/logo (3).png", alt: "Logo 3" },
    { src: "/logo/logo (4).png", alt: "Logo 4" },
    { src: "/logo/logo.png", alt: "Logo 5" },
  ];

  return (
    <>
      {/* Hero Section */}
<div className="bg-white flex justify-center">
  <div className="max-w-[1281px] w-full px-2 py-4 sm:px-4 sm:py-8">
    <div className="flex flex-row lg:flex-row gap-2 sm:gap-4 md:gap-6 justify-center items-center">

      {/* First Box */}
      <div className="img_bg1 relative w-[30%] min-h-[197.7px] aspect-[2/2.5] max-w-[120px] sm:max-w-[140px] md:max-w-[200px] lg:w-[30%] lg:max-w-none lg:aspect-[2/3] lg:min-h-0">
        <Image
          src="/images/59866250d2fc5a879ffcc793dc57565cb166bdcd.png"
          alt="Bottom Image"
          fill
          className="object-cover"
        />
      </div>

      {/* Center Box */}
      <div className="flex flex-col justify-between w-[30%] min-h-[197.7px] aspect-[2/2.5] max-w-[120px] sm:max-w-[140px] md:max-w-[200px] lg:w-[30%] lg:max-w-none lg:aspect-[2/3] lg:min-h-0">
        {/* Top image */}
        <div className="relative w-full h-[25%] rounded-lg overflow-hidden mb-1 sm:mb-2 lg:aspect-[4/1] lg:h-auto lg:mb-4 lg:rounded-xl">
          <Image
            src="/images/images (1).png"
            alt="Top Image"
            fill
            className="object-cover"
          />
        </div>

        {/* Sale Text */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-1 lg:py-6">
          <h2 className="text-[15px] sm:text-xs md:text-sm lg:text-4xl xl:text-5xl font-bold text_colar2 leading-tight">ULTIMATE</h2>
          <h1 className="text-[22px] sm:text-sm md:text-base lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold text-transparent stroke-text leading-tight">SALE</h1>
          <p className="text-[5px] sm:text-[8px] md:text-[10px] lg:text-sm tracking-widest text-gray-500 mt-1 mb-1 lg:mt-2 lg:mb-4">NEW COLLECTION</p>
          <Link href="/fashion">
          <button
           
            className="bg-yellow-400 hover:bg-yellow-500 text-black cursor-pointer font-semibold py-[2px] px-1 text-[6px] sm:text-[8px] md:text-[10px] lg:py-2 lg:px-6 lg:text-base xl:text-lg rounded-md lg:rounded-xl shadow-md">
            SHOP NOW
          </button>
          </Link>
        </div>

        {/* Bottom image */}
        <div className="relative w-full h-[25%] rounded-lg overflow-hidden mt-1 sm:mt-2 lg:aspect-[4/1] lg:h-auto lg:mt-4 lg:rounded-xl">
          <Image
            src="/images/images (B).png"
            alt="Bottom Image"
            fill
            className="object-left-top object-cover"
          />
        </div>
      </div>

      {/* Third Box */}
      <div className="img_bg1 relative w-[30%] min-h-[197.7px] aspect-[2/2.5] max-w-[120px] sm:max-w-[140px] md:max-w-[200px] lg:w-[30%] lg:max-w-none lg:aspect-[2/3] lg:min-h-0">
        <Image
          src="/images/f5c95fe473850a225b7cfa1222bf5117db038cb6 (1).png"
          alt="Side Image"
          fill
          className="object-cover"
        />
      </div>

    </div>
  </div>
</div>

      {/* Company Logos - Responsive */}
<div className="max-w-[1281px] mx-auto p-8 bg-white overflow-hidden pb-8">
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
    </>
  );
}