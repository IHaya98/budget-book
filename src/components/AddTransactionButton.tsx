'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import AddTransactionModal from './AddTransactionModal';

export default function AddTransactionButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        取引を追加
      </button>

      <AddTransactionModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
