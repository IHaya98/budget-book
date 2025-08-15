import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');

    if (!month) {
      return NextResponse.json(
        { error: '月の指定が必要です' },
        { status: 400 }
      );
    }

    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59);

    const transactions = await prisma.transaction.findMany({
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
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('取引の取得に失敗しました:', error);
    return NextResponse.json(
      { error: '取引の取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, type, categoryId, description, date } = body;

    if (!amount || !type || !categoryId || !date) {
      return NextResponse.json(
        { error: '必要な情報が不足しています' },
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

    // カテゴリのタイプと取引のタイプが一致するかチェック
    if (category.type !== type) {
      return NextResponse.json(
        { error: 'カテゴリのタイプと取引のタイプが一致しません' },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        categoryId,
        description,
        date: new Date(date),
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

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('取引の作成に失敗しました:', error);
    return NextResponse.json(
      { error: '取引の作成に失敗しました' },
      { status: 500 }
    );
  }
}
