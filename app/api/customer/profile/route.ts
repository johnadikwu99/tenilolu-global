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

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      include: {
        customer: true,
        admin: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await req.json();
    const { name, phone, deliveryName, deliveryPhone, deliveryAddress, deliveryCity, deliveryState, deliveryPostalCode } = json;

    const user = await prisma.user.update({
      where: { id: (session.user as any).id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        customer: {
          update: {
            ...(deliveryName && { deliveryName }),
            ...(deliveryPhone && { deliveryPhone }),
            ...(deliveryAddress && { deliveryAddress }),
            ...(deliveryCity && { deliveryCity }),
            ...(deliveryState && { deliveryState }),
            ...(deliveryPostalCode && { deliveryPostalCode }),
          },
        },
      },
      include: {
        customer: true,
      },
    });

    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
