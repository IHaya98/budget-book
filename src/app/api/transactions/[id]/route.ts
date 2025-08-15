import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 取引が存在するかチェック
    const transaction = await prisma.transaction.findUnique({
      where: { id }
    });

    if (!transaction) {
      return NextResponse.json(
        { error: '取引が見つかりません' },
        { status: 404 }
      );
    }

    // 取引を削除
    await prisma.transaction.delete({
      where: { id }
    });

    return NextResponse.json({ message: '取引を削除しました' });
  } catch (error) {
    console.error('取引の削除に失敗しました:', error);
    return NextResponse.json(
      { error: '取引の削除に失敗しました' },
      { status: 500 }
    );
  }
}
