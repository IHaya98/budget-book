import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || new Date().toISOString().substring(0, 7);

    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59);

    // 今月の収入・支出を取得
    const [incomeTransactions, expenseTransactions] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          type: 'income',
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          amount: true,
          categoryId: true,
        },
      }),
      prisma.transaction.findMany({
        where: {
          type: 'expense',
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          amount: true,
          categoryId: true,
        },
      }),
    ]);

    // 収入・支出の合計を計算
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    // 今月の予算を取得
    const budgets = await prisma.budget.findMany({
      where: {
        budgetType: 'monthly',
        month: month,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    // 予算達成率を計算
    const budgetProgress = budgets.map(budget => {
      const categoryExpenses = expenseTransactions.filter(t => 
        t.categoryId === budget.categoryId
      );
      const spent = categoryExpenses.reduce((sum, t) => sum + t.amount, 0);
      const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      
      return {
        categoryId: budget.categoryId,
        categoryName: budget.category.name,
        categoryColor: budget.category.color,
        budget: budget.amount,
        spent,
        remaining: budget.amount - spent,
        progress: Math.min(progress, 100),
        isOverBudget: spent > budget.amount,
      };
    });

    // 最近の取引履歴（最新5件）
    const recentTransactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      take: 5,
    });

    // カテゴリ別支出ランキング
    const categoryExpenses = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        type: 'expense',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
      take: 5,
    });

    const categoryExpenseDetails = await Promise.all(
      categoryExpenses.map(async (cat) => {
        const category = await prisma.category.findUnique({
          where: { id: cat.categoryId },
          select: { name: true, color: true },
        });
        return {
          categoryId: cat.categoryId,
          categoryName: category?.name || '不明',
          categoryColor: category?.color || '#000000',
          amount: cat._sum.amount || 0,
        };
      })
    );

    return NextResponse.json({
      month,
      totalIncome,
      totalExpense,
      balance,
      budgetProgress,
      recentTransactions,
      categoryExpenseDetails,
    });
  } catch (error) {
    console.error('ダッシュボードデータの取得に失敗しました:', error);
    return NextResponse.json(
      { error: 'ダッシュボードデータの取得に失敗しました' },
      { status: 500 }
    );
  }
}
