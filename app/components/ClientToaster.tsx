'use client';

import { Toaster } from 'react-hot-toast';

export function ClientToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        className: 'dark:bg-gray-800 dark:text-white',
        style: {
          background: '#fff',
          color: '#000',
        },
      }}
    />
  );
} 