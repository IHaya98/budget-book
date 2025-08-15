'use client';

import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Divider,
  Progress,
  Chip,
  Select,
  SelectItem
} from "@heroui/react";

interface Budget {
  id: string;
  amount: number;
  month: string | null;
  year: number;
  budgetType: 'yearly' | 'monthly';
  expenseType: 'fixed' | 'variable';
  category: {
    id: string;
    name: string;
    color: string;
    type: 'income' | 'expense';
  };
}

interface BudgetWithProgress extends Budget {
  spent: number;
  progress: number;
}

interface BudgetListProps {
  budgetType: 'yearly' | 'monthly';
}

export default function BudgetList({ budgetType }: BudgetListProps) {
  const [budgets, setBudgets] = useState<BudgetWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [year, setYear] = useState(new Date().getFullYear());
  const [expenseTypeFilter, setExpenseTypeFilter] = useState<'all' | 'fixed' | 'variable'>('all');



  const fetchBudgets = async () => {
    try {
      const params = new URLSearchParams({
        budgetType,
        ...(budgetType === 'monthly' ? { month } : { year: year.toString() })
      });
      
      const response = await fetch(`/api/budgets?${params}`);
      if (response.ok) {
        const data = await response.json();
        setBudgets(data);
      }
    } catch (error) {
      console.error('予算の取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year, budgetType]);
  
  const handleDelete = async (id: string) => {
    if (!confirm('この予算を削除しますか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBudgets(budgets.filter(b => b.id !== id));
      }
    } catch (error) {
      console.error('予算の削除に失敗しました:', error);
    }
  };

  if (loading) {
    return (
      <Card className="bg-content1">
        <CardBody className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-default-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-default-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (budgets.length === 0) {
    return (
      <Card className="bg-content1">
        <CardBody className="p-6 text-center">
          <div className="text-default-500">
            <PlusIcon className="mx-auto h-12 w-12 text-default-400 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {budgetType === 'yearly' ? '年間予算' : '月間予算'}が設定されていません
            </h3>
            <p className="text-default-500">最初の予算を設定しましょう</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const filteredBudgets = budgets.filter(budget => {
    if (expenseTypeFilter === 'all') return true;
    return budget.expenseType === expenseTypeFilter;
  });

  const expenseBudgets = filteredBudgets.filter(b => b.category.type === 'expense');
  const totalBudget = expenseBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = expenseBudgets.reduce((sum, b) => sum + b.spent, 0);
  const overallProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const fixedBudgets = expenseBudgets.filter(b => b.expenseType === 'fixed');
  const variableBudgets = expenseBudgets.filter(b => b.expenseType === 'variable');

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-content1">
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex space-x-4">
              <Select
                label="費目タイプ"
                selectedKeys={[expenseTypeFilter]}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSelectionChange={(keys) => setExpenseTypeFilter(Array.from(keys)[0] as any)}
                className="w-32"
              >
                <SelectItem key="all">すべて</SelectItem>
                <SelectItem key="fixed">固定費</SelectItem>
                <SelectItem key="variable">変動費</SelectItem>
              </Select>
            </div>
            <div className="flex space-x-4">
              {budgetType === 'monthly' ? (
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="px-3 py-2 border border-default-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              ) : (
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="px-3 py-2 border border-default-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="年"
                />
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Overall Progress */}
      <Card className="bg-content1">
        <CardBody className="p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">全体の進捗</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
            <div>
              <p className="text-sm font-medium text-default-500">予算合計</p>
              <p className="text-2xl font-semibold text-foreground">¥{totalBudget.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-default-500">支出合計</p>
              <p className="text-2xl font-semibold text-foreground">¥{totalSpent.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-default-500">残り予算</p>
              <p className="text-2xl font-semibold text-foreground">¥{(totalBudget - totalSpent).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-default-500">達成率</p>
              <p className="text-2xl font-semibold text-foreground">{overallProgress.toFixed(1)}%</p>
            </div>
          </div>
          <Progress
            value={Math.min(overallProgress, 100)}
            color={overallProgress > 100 ? "danger" : overallProgress > 80 ? "warning" : "success"}
            className="w-full"
          />
        </CardBody>
      </Card>

      {/* Fixed vs Variable Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-content1">
          <CardHeader className="px-6 py-4">
            <h3 className="text-lg font-medium text-foreground">固定費</h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary mb-2">
                ¥{fixedBudgets.reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-default-500">
                設定済み: {fixedBudgets.length}件
              </p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-content1">
          <CardHeader className="px-6 py-4">
            <h3 className="text-lg font-medium text-foreground">変動費</h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary mb-2">
                ¥{variableBudgets.reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-default-500">
                設定済み: {variableBudgets.length}件
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Budgets List */}
      <Card className="bg-content1">
        <CardHeader className="px-6 py-4">
          <h3 className="text-lg font-medium text-foreground">カテゴリ別予算</h3>
        </CardHeader>
        <Divider />
        <CardBody className="p-0">
          <div className="divide-y divide-divider">
            {filteredBudgets.map((budget) => (
              <div key={budget.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: budget.category.color }}
                      ></div>
                      <span className="text-sm font-medium text-foreground">
                        {budget.category.name}
                      </span>
                      <Chip
                        size="sm"
                        color={budget.expenseType === 'fixed' ? 'primary' : 'secondary'}
                        variant="flat"
                      >
                        {budget.expenseType === 'fixed' ? '固定費' : '変動費'}
                      </Chip>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-default-500 mb-2">
                      <span>¥{budget.spent.toLocaleString()} / ¥{budget.amount.toLocaleString()}</span>
                      <span>{budget.progress.toFixed(1)}%</span>
                    </div>
                    
                    <Progress
                      value={Math.min(budget.progress, 100)}
                      color={budget.progress > 100 ? "danger" : budget.progress > 80 ? "warning" : "success"}
                      className="w-full"
                      size="sm"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => {/* TODO: 編集モーダルを開く */}}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => handleDelete(budget.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
