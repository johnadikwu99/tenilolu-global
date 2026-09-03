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

    const [totalSales, totalOrders, totalCustomers, pendingOrders, lowStockProducts, recentOrders] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: 'DELIVERED', paymentStatus: 'COMPLETED' },
      }),
      prisma.order.count(),
      prisma.customer.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.product.count({ where: { stock: { lte: 10 }, enabled: true } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
    ]);

    return NextResponse.json({
      totalSales: totalSales._sum.total || 0,
      totalOrders,
      totalCustomers,
      pendingOrders,
      lowStockProducts,
      recentOrders,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
