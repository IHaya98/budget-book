'use client';

import Navigation from '@/components/Navigation';
import BudgetList from '@/components/BudgetList';
import AddBudgetButton from '@/components/AddBudgetButton';
import { Tabs, Tab } from "@heroui/react";

export default function BudgetsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">予算設定</h1>
            <p className="mt-2 text-default-500">年間・月間の予算を設定・管理しましょう</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <AddBudgetButton />
          </div>
        </div>

        <Tabs aria-label="予算タイプ" className="mb-6">
          <Tab key="monthly" title="月間予算">
            <BudgetList budgetType="monthly" />
          </Tab>
          <Tab key="yearly" title="年間予算">
            <BudgetList budgetType="yearly" />
          </Tab>
        </Tabs>
      </main>
    </div>
  );
}
