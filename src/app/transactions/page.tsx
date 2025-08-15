'use client';

import Navigation from '@/components/Navigation';
import TransactionList from '@/components/TransactionList';
import AddTransactionButton from '@/components/AddTransactionButton';

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">収支管理</h1>
            <p className="mt-2 text-default-500">収入と支出を記録・管理しましょう</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <AddTransactionButton />
          </div>
        </div>

        <TransactionList />
      </main>
    </div>
  );
}
