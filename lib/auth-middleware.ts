import { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export function withAuth(
  handler: (req: NextRequest, context: any) => Promise<NextResponse>,
  requiredRole?: string
) {
  return async (req: NextRequest, context: any) => {
    try {
      const token = req.cookies.get('next-auth.session-token')?.value;
      
      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Token validation would happen here with next-auth
      return handler(req, context);
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  };
}

export function requireAdmin(session: Session | null) {
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    throw new Error('Admin access required');
  }
}

export function requireAuth(session: Session | null) {
  if (!session) {
    throw new Error('Authentication required');
  }
}
