'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
}

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddBudgetModal({ isOpen, onClose }: AddBudgetModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    budgetType: 'monthly' as 'yearly' | 'monthly',
    expenseType: 'variable' as 'fixed' | 'variable',
    month: new Date().toISOString().split('T')[0].substring(0, 7),
    year: new Date().getFullYear()
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        // デフォルトのカテゴリを設定
        const defaultCategory = data.find((cat: Category) => cat.type === 'expense');
        if (defaultCategory) {
          setFormData(prev => ({ ...prev, categoryId: defaultCategory.id }));
        }
      }
    } catch (error) {
      console.error('カテゴリの取得に失敗しました:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId) return;

    setLoading(true);
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (response.ok) {
        setFormData({
          categoryId: '',
          amount: '',
          budgetType: 'monthly',
          expenseType: 'variable',
          month: new Date().toISOString().split('T')[0].substring(0, 7),
          year: new Date().getFullYear()
        });
        onClose();
        // ページをリロードして新しい予算を表示
        window.location.reload();
      }
    } catch (error) {
      console.error('予算の設定に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">予算を設定</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 予算タイプ */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="budgetType" className="block text-sm font-medium text-gray-700 mb-1">
                    予算タイプ
                  </label>
                  <select
                    id="budgetType"
                    value={formData.budgetType}
                    onChange={(e) => {
                      const newType = e.target.value as 'yearly' | 'monthly';
                      setFormData(prev => ({ 
                        ...prev, 
                        budgetType: newType,
                        month: newType === 'yearly' ? '' : prev.month
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 text-black"
                  >
                    <option value="monthly">月間予算</option>
                    <option value="yearly">年間予算</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="expenseType" className="block text-sm font-medium text-gray-700 mb-1">
                    費目タイプ
                  </label>
                  <select
                    id="expenseType"
                    value={formData.expenseType}
                    onChange={(e) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        expenseType: e.target.value as 'fixed' | 'variable'
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 text-black"
                  >
                    <option value="fixed">固定費</option>
                    <option value="variable">変動費</option>
                  </select>
                </div>
              </div>

              {/* カテゴリ */}
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                  カテゴリ
                </label>
                <select
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, categoryId: e.target.value }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 text-black"
                  required
                >
                  <option value="">カテゴリを選択</option>
                  {expenseCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 金額 */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  予算金額
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">¥</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0"
                    min="0"
                    step="1"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                    required
                  />
                </div>
              </div>

              {/* 期間 */}
              <div className="grid grid-cols-2 gap-4">
                {formData.budgetType === 'monthly' ? (
                  <div>
                    <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                      対象月
                    </label>
                    <input
                      type="month"
                      id="month"
                      value={formData.month}
                      onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                      対象年
                    </label>
                    <input
                      type="number"
                      id="year"
                      value={formData.year.toString()}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      placeholder="2024"
                      min="2000"
                      max="2100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                      required
                    />
                  </div>
                )}
              </div>

              {/* 説明 */}
              <div className="text-sm text-gray-600">
                <p><strong>固定費:</strong> 毎月（または毎年）一定の金額が発生する費用（家賃、光熱費、保険料など）</p>
                <p><strong>変動費:</strong> 月によって金額が変動する費用（食費、交通費、娯楽費など）</p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.amount || !formData.categoryId}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '設定中...' : '設定'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
