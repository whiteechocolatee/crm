'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Something went wrong!
          </h1>

          <p className="mb-6 text-gray-600">
            {error.message || 'An unexpected error occurred'}
          </p>

          <div className="mb-4 text-xs text-gray-500">
            Error ID: {error.digest}
          </div>

          <Link
            href="/"
            className="w-full rounded-md bg-red-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-700"
          >
            Back home
          </Link>
        </div>
      </body>
    </html>
  );
}
