import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 予算が存在するかチェック
    const budget = await prisma.budget.findUnique({
      where: { id }
    });

    if (!budget) {
      return NextResponse.json(
        { error: '予算が見つかりません' },
        { status: 404 }
      );
    }

    // 予算を削除
    await prisma.budget.delete({
      where: { id }
    });

    return NextResponse.json({ message: '予算を削除しました' });
  } catch (error) {
    console.error('予算の削除に失敗しました:', error);
    return NextResponse.json(
      { error: '予算の削除に失敗しました' },
      { status: 500 }
    );
  }
}
