import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const budgetType = searchParams.get('budgetType');

    if (!budgetType) {
      return NextResponse.json(
        { error: '予算タイプの指定が必要です' },
        { status: 400 }
      );
    }

    if (budgetType === 'monthly' && !month) {
      return NextResponse.json(
        { error: '月間予算の場合、月の指定が必要です' },
        { status: 400 }
      );
    }

    if (budgetType === 'yearly' && !year) {
      return NextResponse.json(
        { error: '年間予算の場合、年の指定が必要です' },
        { status: 400 }
      );
    }

    let startDate: Date;
    let endDate: Date;

    if (budgetType === 'monthly') {
      const [yearNum, monthNum] = month!.split('-').map(Number);
      startDate = new Date(yearNum, monthNum - 1, 1);
      endDate = new Date(yearNum, monthNum, 0, 23, 59, 59);
    } else {
      startDate = new Date(parseInt(year!), 0, 1);
      endDate = new Date(parseInt(year!), 11, 31, 23, 59, 59);
    }

    // 予算を取得
    const budgets = await prisma.budget.findMany({
      where: {
        budgetType,
        ...(budgetType === 'monthly' ? { month } : { year: parseInt(year!) }),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            type: true,
          },
        },
      },
      orderBy: [
        { expenseType: 'asc' },
        { category: { name: 'asc' } }
      ],
    });

    // 各予算の実際の支出額を計算
    const budgetsWithProgress = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await prisma.transaction.aggregate({
          where: {
            categoryId: budget.categoryId,
            type: 'expense',
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          _sum: {
            amount: true,
          },
        });

        const spentAmount = spent._sum.amount || 0;
        const progress = budget.amount > 0 ? (spentAmount / budget.amount) * 100 : 0;

        return {
          ...budget,
          spent: spentAmount,
          progress,
        };
      })
    );

    return NextResponse.json(budgetsWithProgress);
  } catch (error) {
    console.error('予算の取得に失敗しました:', error);
    return NextResponse.json(
      { error: '予算の取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryId, amount, month, year, budgetType, expenseType } = body;

    if (!categoryId || !amount || !budgetType || !expenseType) {
      return NextResponse.json(
        { error: '必要な情報が不足しています' },
        { status: 400 }
      );
    }

    if (budgetType === 'monthly' && !month) {
      return NextResponse.json(
        { error: '月間予算の場合、月の指定が必要です' },
        { status: 400 }
      );
    }

    if (budgetType === 'yearly' && !year) {
      return NextResponse.json(
        { error: '年間予算の場合、年の指定が必要です' },
        { status: 400 }
      );
    }

    // カテゴリが存在するかチェック
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'カテゴリが見つかりません' },
        { status: 400 }
      );
    }

    // 同じ期間の同じカテゴリの予算が既に存在するかチェック
    const existingBudget = await prisma.budget.findFirst({
      where: {
        categoryId,
        budgetType,
        ...(budgetType === 'monthly' ? { month } : { year }),
      }
    });

    if (existingBudget) {
      return NextResponse.json(
        { error: '同じ期間の同じカテゴリの予算が既に設定されています' },
        { status: 400 }
      );
    }

    const yearNum = budgetType === 'monthly' ? parseInt(month!.split('-')[0]) : parseInt(year!);
    const monthNum = budgetType === 'monthly' ? parseInt(month!.split('-')[1]) : null;

    const budget = await prisma.budget.create({
      data: {
        categoryId,
        amount,
        month: budgetType === 'monthly' ? month : null,
        year: yearNum,
        monthNum,
        budgetType,
        expenseType,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            type: true,
          },
        },
      },
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error('予算の設定に失敗しました:', error);
    return NextResponse.json(
      { error: '予算の設定に失敗しました' },
      { status: 500 }
    );
  }
}
