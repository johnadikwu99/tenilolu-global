'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { ChevronRight } from 'react-icons/fa';

export default function AdminProducts() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, router, session]);

  if (status === 'loading' || !session || (session?.user as any)?.role !== 'ADMIN') {
    return (
      <>
        <Navbar />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-sm text-secondary-600 mb-6">
          <Link href="/admin/dashboard" className="hover:text-primary-600">Dashboard</Link>
          <ChevronRight size={16} />
          <span>Products</span>
        </div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Products Management</h1>
          <Button onClick={() => router.push('/admin/products/new')}>Add Product</Button>
        </div>
        <p className="text-secondary-600">Product management interface coming soon...</p>
      </div>
      <Footer />
    </>
  );
}
