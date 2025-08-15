'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  Input, 
  Select, 
 SelectItem,
  Chip
} from "@heroui/react";

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          予算を設定
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 予算タイプ */}
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="予算タイプ"
                selectedKeys={[formData.budgetType]}
                onSelectionChange={(keys) => {
                  const newType = Array.from(keys)[0] as 'yearly' | 'monthly';
                  setFormData(prev => ({ 
                    ...prev, 
                    budgetType: newType,
                    month: newType === 'yearly' ? '' : prev.month
                  }));
                }}
              >
                <SelectItem key="monthly" value="monthly">月間予算</SelectItem>
                <SelectItem key="yearly" value="yearly">年間予算</SelectItem>
              </Select>

              <Select
                label="費目タイプ"
                selectedKeys={[formData.expenseType]}
                onSelectionChange={(keys) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    expenseType: Array.from(keys)[0] as 'fixed' | 'variable'
                  }));
                }}
              >
                <SelectItem key="fixed" value="fixed">固定費</SelectItem>
                <SelectItem key="variable" value="variable">変動費</SelectItem>
              </Select>
            </div>

            {/* カテゴリ */}
            <Select
              label="カテゴリ"
              selectedKeys={[formData.categoryId]}
              onSelectionChange={(keys) => {
                setFormData(prev => ({ ...prev, categoryId: Array.from(keys)[0] as string }));
              }}
              isRequired
            >
              <SelectItem key="" value="">カテゴリを選択</SelectItem>
              {expenseCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </Select>

            {/* 金額 */}
            <Input
              type="number"
              label="予算金額"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0"
              min="0"
              step="1"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">¥</span>
                </div>
              }
              isRequired
            />

            {/* 期間 */}
            <div className="grid grid-cols-2 gap-4">
              {formData.budgetType === 'monthly' ? (
                <Input
                  type="month"
                  label="対象月"
                  value={formData.month}
                  onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                  isRequired
                />
              ) : (
                <Input
                  type="number"
                  label="対象年"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  placeholder="2024"
                  min="2000"
                  max="2100"
                  isRequired
                />
              )}
            </div>

            {/* 説明 */}
            <div className="text-sm text-default-500">
              <p><strong>固定費:</strong> 毎月（または毎年）一定の金額が発生する費用（家賃、光熱費、保険料など）</p>
              <p><strong>変動費:</strong> 月によって金額が変動する費用（食費、交通費、娯楽費など）</p>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="bordered" onPress={onClose}>
            キャンセル
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit}
            isLoading={loading}
            isDisabled={!formData.amount || !formData.categoryId}
          >
            設定
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
