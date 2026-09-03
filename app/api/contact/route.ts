import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactFormSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validatedData = contactFormSchema.parse(json);

    const message = await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        subject: validatedData.subject,
        message: validatedData.message,
      },
    });

    return NextResponse.json(
      { message: 'Message sent successfully', id: message.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Contact form error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
