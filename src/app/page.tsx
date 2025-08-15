'use client';

import Navigation from '@/components/Navigation';
import { ArrowUpIcon, ArrowDownIcon, BanknotesIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Divider,
} from "@heroui/react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">ダッシュボード</h1>
          <p className="mt-2 text-default-500">今月の家計状況を確認しましょう</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-content1">
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ArrowUpIcon className="h-8 w-8 text-success" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-default-500">今月の収入</p>
                  <p className="text-2xl font-semibold text-foreground">¥350,000</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-content1">
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ArrowDownIcon className="h-8 w-8 text-danger" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-default-500">今月の支出</p>
                  <p className="text-2xl font-semibold text-foreground">¥280,000</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-content1">
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BanknotesIcon className="h-8 w-8 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-default-500">残高</p>
                  <p className="text-2xl font-semibold text-foreground">¥70,000</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-content1">
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-8 w-8 text-secondary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-default-500">予算達成率</p>
                  <p className="text-2xl font-semibold text-foreground">85%</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-content1 hover:bg-content2 transition-colors cursor-pointer">
            <CardBody className="p-6">
              <Link href="/transactions/new" className="block">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-danger-100 rounded-lg flex items-center justify-center">
                      <ArrowDownIcon className="h-6 w-6 text-danger" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-foreground">支出を記録</h3>
                    <p className="text-sm text-default-500">新しい支出を追加</p>
                  </div>
                </div>
              </Link>
            </CardBody>
          </Card>

          <Card className="bg-content1 hover:bg-content2 transition-colors cursor-pointer">
            <CardBody className="p-6">
              <Link href="/transactions/new?type=income" className="block">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-success-100 rounded-lg flex items-center justify-center">
                      <ArrowUpIcon className="h-6 w-6 text-success" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-foreground">収入を記録</h3>
                    <p className="text-sm text-default-500">新しい収入を追加</p>
                  </div>
                </div>
              </Link>
            </CardBody>
          </Card>

          <Card className="bg-content1 hover:bg-content2 transition-colors cursor-pointer">
            <CardBody className="p-6">
              <Link href="/budgets" className="block">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                      <ChartBarIcon className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-foreground">予算を設定</h3>
                    <p className="text-sm text-default-500">月間予算を管理</p>
                  </div>
                </div>
              </Link>
            </CardBody>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-content1">
          <CardHeader className="px-6 py-4">
            <h3 className="text-lg font-medium text-foreground">最近の取引</h3>
          </CardHeader>
          <Divider />
          <CardBody className="p-0">
            <div className="divide-y divide-divider">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-danger-100 rounded-full flex items-center justify-center">
                      <ArrowDownIcon className="h-4 w-4 text-danger" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-foreground">食費</p>
                      <p className="text-sm text-default-500">スーパーで買い物</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-danger">-¥5,000</p>
                    <p className="text-sm text-default-400">今日</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-success-100 rounded-full flex items-center justify-center">
                      <ArrowUpIcon className="h-4 w-4 text-success" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-foreground">給料</p>
                      <p className="text-sm text-default-500">月給</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-success">+¥350,000</p>
                    <p className="text-sm text-default-400">昨日</p>
                  </div>
                </div>
              </div>
            </div>
            <Divider />
            <div className="px-6 py-4">
              <Link href="/transactions" className="text-sm font-medium text-primary hover:text-primary-500">
                すべての取引を見る →
              </Link>
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
