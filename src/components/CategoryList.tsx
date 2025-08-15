'use client';

import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Category } from '@prisma/client';

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('カテゴリの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('このカテゴリを削除しますか？関連する取引も削除されます。')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCategories(categories.filter(cat => cat.id !== id));
      }
    } catch (error) {
      console.error('カテゴリの削除に失敗しました:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="text-gray-500">
          <PlusIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">カテゴリがありません</h3>
          <p className="text-gray-500">最初のカテゴリを追加しましょう</p>
        </div>
      </div>
    );
  }

  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  return (
    <div className="space-y-6">
      {/* 収入カテゴリ */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
            収入カテゴリ
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {incomeCategories.map((category) => (
            <div key={category.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {/* TODO: 編集モーダルを開く */}}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {incomeCategories.length === 0 && (
            <div className="px-6 py-4 text-center text-gray-500">
              収入カテゴリがありません
            </div>
          )}
        </div>
      </div>

      {/* 支出カテゴリ */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
            支出カテゴリ
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {expenseCategories.map((category) => (
            <div key={category.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {/* TODO: 編集モーダルを開く */}}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {expenseCategories.length === 0 && (
            <div className="px-6 py-4 text-center text-gray-500">
              支出カテゴリがありません
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
