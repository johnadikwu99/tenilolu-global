import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const loyaltyAccount = await prisma.loyaltyAccount.findUnique({
      where: { userId: (session.user as any).id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!loyaltyAccount) {
      return NextResponse.json({ error: 'Loyalty account not found' }, { status: 404 });
    }

    return NextResponse.json(loyaltyAccount);
  } catch (error) {
    console.error('Get loyalty account error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loyalty account' },
      { status: 500 }
    );
  }
}
