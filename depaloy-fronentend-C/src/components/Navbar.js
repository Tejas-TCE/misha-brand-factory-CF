'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (href) => {
    if (href === '/fashion') {
      localStorage.setItem('activeTag',''); // ✅ set empty value
    }
    setIsOpen(false); // also close mobile menu if open
  };

  return (
    <nav className="text_colar flex justify-center relative">
      <div className="w-full max-w-[1277px] flex items-center px-4 md:px-8 h-[105.12px]">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="block">
            <Image
              src="/MishaBrandsFaetory.png"
              width={109}
              height={105}
              alt="Logo"
              className="h-[80px] sm:h-[70px] md:h-[85px] lg:h-[105px] w-auto object-contain"
              priority
            />
          </Link>
        </div>

        <div className="flex-grow" />

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-8 font-medium text-sm">
          {['/', '/fashion'].map((href, idx) => {
            const labels = ['Home', 'Our Product'];
            return (
              <li
                key={href}
                className="border-b-2 border-transparent hover:border-black transition-all duration-200"
              >
                <Link
                  href={href}
                  className="hover:text-gray-600 nav_li"
                  onClick={() => handleClick(href)}
                >
                  {labels[idx]}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden ml-4 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
          type="button"
        >
          <svg
            className="w-6 h-6 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden md:hidden bg-white w-full absolute top-[105.12px] z-50 ${
          isOpen ? 'max-h-[300px]' : 'max-h-0'
        }`}
      >
        <ul className="flex flex-col text-sm font-medium px-4 max-w-[1277px] mx-auto">
          {['/', '/fashion'].map((href, idx) => {
            const labels = ['Home', 'Our Product'];
            return (
              <li key={href} className="border-b border-gray-200">
                <Link
                  href={href}
                  className="block px-4 py-3 hover:bg-gray-100"
                  onClick={() => handleClick(href)}
                >
                  {labels[idx]}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
