import React from "react";

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}

export default function Error({ 
  message = "An unexpected error occurred. Please try again later.", 
  onRetry 
}: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[250px] p-6 text-center">
      <div className="flex items-center justify-center w-16 h-16 mb-4 bg-red-100 rounded-full text-red-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">Oops! Something went wrong</h3>
      <p className="mb-6 text-sm text-gray-500 max-w-sm">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
