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

    const codes = await prisma.discountCode.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(codes);
  } catch (error) {
    console.error('Get discount codes error:', error);
    return NextResponse.json({ error: 'Failed to fetch discount codes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const json = await req.json();
    const validatedData = json; // You would validate this with your schema

    const code = await prisma.discountCode.create({
      data: {
        code: validatedData.code.toUpperCase(),
        type: validatedData.type,
        value: validatedData.value,
        maxUses: validatedData.maxUses,
        minOrderAmount: validatedData.minOrderAmount || 0,
        maxDiscount: validatedData.maxDiscount,
        activeUntil: validatedData.activeUntil ? new Date(validatedData.activeUntil) : undefined,
      },
    });

    return NextResponse.json(code, { status: 201 });
  } catch (error: any) {
    console.error('Create discount code error:', error);
    return NextResponse.json({ error: 'Failed to create discount code' }, { status: 500 });
  }
}
