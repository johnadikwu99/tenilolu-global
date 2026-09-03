import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkoutSchema } from '@/lib/validations';
import { generateOrderNumber, calculateLoyaltyPoints } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await req.json();
    const validatedData = checkoutSchema.parse(json);
    const { items, discountCode } = json;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Verify stock and get product info
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i: any) => i.productId) } },
    });

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }

    let discountAmount = 0;
    if (discountCode) {
      const code = await prisma.discountCode.findUnique({
        where: { code: discountCode },
      });

      if (code && code.enabled) {
        if (code.maxUses && code.usedCount >= code.maxUses) {
          return NextResponse.json(
            { error: 'Discount code has been used' },
            { status: 400 }
          );
        }

        if (subtotal >= code.minOrderAmount) {
          if (code.type === 'PERCENTAGE') {
            discountAmount = (subtotal * code.value) / 100;
            if (code.maxDiscount) {
              discountAmount = Math.min(discountAmount, code.maxDiscount);
            }
          } else {
            discountAmount = code.value;
          }
        }
      }
    }

    const total = subtotal - discountAmount;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: (session.user as any).id,
        customerName: validatedData.name,
        customerEmail: validatedData.email,
        customerPhone: validatedData.phone,
        deliveryAddress: validatedData.address,
        deliveryCity: validatedData.city,
        deliveryState: validatedData.state,
        deliveryPostalCode: validatedData.postalCode,
        subtotal,
        discountAmount,
        discountCode: discountCode || null,
        total,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    // Decrement stock
    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
          purchases: { increment: 1 },
        },
      });
    }

    // Update discount code usage
    if (discountCode) {
      await prisma.discountCode.update({
        where: { code: discountCode },
        data: { usedCount: { increment: 1 } },
      });
    }

    // Add loyalty points
    const points = calculateLoyaltyPoints(total);
    if (points > 0) {
      const loyaltyAccount = await prisma.loyaltyAccount.findUnique({
        where: { userId: (session.user as any).id },
      });

      if (loyaltyAccount) {
        await prisma.loyaltyTransaction.create({
          data: {
            accountId: loyaltyAccount.id,
            amount: points,
            type: 'purchase',
            description: `Points from order ${order.orderNumber}`,
          },
        });

        await prisma.loyaltyAccount.update({
          where: { id: loyaltyAccount.id },
          data: { balance: { increment: points } },
        });
      }
    }

    // Update customer stats
    await prisma.customer.update({
      where: { userId: (session.user as any).id },
      data: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: total },
        lastOrderDate: new Date(),
      },
    });

    return NextResponse.json(
      { order, message: 'Order created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create order error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
