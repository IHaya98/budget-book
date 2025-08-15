import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // カテゴリが存在するかチェック
    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'カテゴリが見つかりません' },
        { status: 404 }
      );
    }

    // カテゴリと関連するデータを削除
    await prisma.category.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'カテゴリを削除しました' });
  } catch (error) {
    console.error('カテゴリの削除に失敗しました:', error);
    return NextResponse.json(
      { error: 'カテゴリの削除に失敗しました' },
      { status: 500 }
    );
  }
}
