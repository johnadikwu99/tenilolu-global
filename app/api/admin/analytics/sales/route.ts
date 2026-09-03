import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function isAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  return session && (session.user as any)?.role === 'ADMIN';
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'month';

    const now = new Date();
    let startDate = new Date();

    if (range === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (range === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (range === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    }

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        paymentStatus: 'COMPLETED',
      },
      include: { items: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const grouped: Record<string, any> = {};
    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = {
          date,
          sales: 0,
          orders: 0,
        };
      }
      grouped[date].sales += order.total;
      grouped[date].orders += 1;
    });

    const salesData = Object.values(grouped);

    const bestSellingProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      _count: true,
      where: {
        order: {
          createdAt: { gte: startDate },
        },
      },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    return NextResponse.json({
      salesData,
      bestSellingProducts,
      range,
    });
  } catch (error) {
    console.error('Get sales analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
