// app/not-found.js
'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-white">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="mt-4 text-xl text-gray-800">Page Not Found</p>
      <p className="mt-2 text-gray-500">Sorry, the page youre looking for doesnt exist.</p>
      <Link href="/" className="mt-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
        Go to Homepage
      </Link>
    </div>
  );
}
