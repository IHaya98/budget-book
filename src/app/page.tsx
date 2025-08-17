'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { ArrowUpIcon, ArrowDownIcon, BanknotesIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface DashboardData {
  month: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  budgetProgress: Array<{
    categoryId: string;
    categoryName: string;
    categoryColor: string;
    budget: number;
    spent: number;
    remaining: number;
    progress: number;
    isOverBudget: boolean;
  }>;
  recentTransactions: Array<{
    id: string;
    amount: number;
    type: 'income' | 'expense';
    description: string;
    date: string;
    category: {
      id: string;
      name: string;
      color: string;
    };
  }>;
  categoryExpenseDetails: Array<{
    categoryId: string;
    categoryName: string;
    categoryColor: string;
    amount: number;
  }>;
}

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const currentMonth = new Date().toISOString().substring(0, 7);
      const response = await fetch(`/api/dashboard?month=${currentMonth}`);
      
      if (!response.ok) {
        throw new Error('ダッシュボードデータの取得に失敗しました');
      }
      
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">ダッシュボード</h1>
            <p className="mt-2 text-default-500">今月の家計状況を確認しましょう</p>
          </div>
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">ダッシュボード</h1>
            <p className="mt-2 text-default-500">今月の家計状況を確認しましょう</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">エラー: {error}</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              再試行
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">ダッシュボード</h1>
          <p className="mt-2 text-default-500">
            {dashboardData.month}の家計状況を確認しましょう
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowUpIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">今月の収入</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ¥{dashboardData.totalIncome.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowDownIcon className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">今月の支出</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ¥{dashboardData.totalExpense.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BanknotesIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">残高</p>
                <p className={`text-2xl font-semibold ${
                  dashboardData.balance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ¥{dashboardData.balance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">予算設定数</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData.budgetProgress.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Progress */}
        {dashboardData.budgetProgress.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">予算達成率</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.budgetProgress.map((budget) => (
                <div key={budget.categoryId} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{budget.categoryName}</h3>
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: budget.categoryColor }}
                    ></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>予算: ¥{budget.budget.toLocaleString()}</span>
                      <span>使用: ¥{budget.spent.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          budget.isOverBudget ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(budget.progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {budget.progress.toFixed(1)}% 達成
                      {budget.isOverBudget && (
                        <span className="text-red-600 ml-2">予算超過</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/transactions" className="block p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <BanknotesIcon className="h-6 w-6 text-red-500" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">収入・支出を記録</h3>
                  <p className="text-sm text-gray-500">新しい収入・支出を追加</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/budgets" className="block p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">予算を設定</h3>
                  <p className="text-sm text-gray-500">月間予算を管理</p>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/transactions" className="block p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="h-6 w-6 text-green-500" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">カテゴリの設定</h3>
                  <p className="text-sm text-gray-500">カテゴリを設定</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Transactions */}
        {dashboardData.recentTransactions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">最近の取引</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="divide-y divide-gray-200">
                {dashboardData.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: transaction.category.color }}
                        ></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.description || '取引'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.category.name} • {new Date(transaction.date).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}¥{transaction.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Category Expense Ranking */}
        {dashboardData.categoryExpenseDetails.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">カテゴリ別支出ランキング</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="divide-y divide-gray-200">
                {dashboardData.categoryExpenseDetails.map((category, index) => (
                  <div key={category.categoryId} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: category.categoryColor }}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">
                          {category.categoryName}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-red-600">
                        ¥{category.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

