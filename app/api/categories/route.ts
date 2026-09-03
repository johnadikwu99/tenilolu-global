import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      where: { enabled: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { products: { where: { enabled: true } } },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
