'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { formatNaira } from '@/lib/utils';
import { Package, ShoppingCart, Users, TrendingUp } from 'react-icons/fa';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  pendingOrders: number;
  lowStockProducts: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, router, session]);

  useEffect(() => {
    if (session && (session?.user as any)?.role === 'ADMIN') {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || !session || (session?.user as any)?.role !== 'ADMIN') {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <LoadingSkeleton className="h-12 w-1/3 mb-8" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-secondary-900 mb-8">Admin Dashboard</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingSkeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : stats ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg border border-secondary-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-600 text-sm font-medium mb-1">Total Sales</p>
                    <p className="text-2xl font-bold text-secondary-900">{formatNaira(stats.totalSales)}</p>
                  </div>
                  <TrendingUp className="text-primary-600" size={32} />
                </div>
              </div>

              <div className="bg-white rounded-lg border border-secondary-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-600 text-sm font-medium mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-secondary-900">{stats.totalOrders}</p>
                  </div>
                  <ShoppingCart className="text-blue-600" size={32} />
                </div>
              </div>

              <div className="bg-white rounded-lg border border-secondary-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-600 text-sm font-medium mb-1">Customers</p>
                    <p className="text-2xl font-bold text-secondary-900">{stats.totalCustomers}</p>
                  </div>
                  <Users className="text-green-600" size={32} />
                </div>
              </div>

              <div className="bg-white rounded-lg border border-secondary-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-600 text-sm font-medium mb-1">Pending Orders</p>
                    <p className="text-2xl font-bold text-secondary-900">{stats.pendingOrders}</p>
                  </div>
                  <Package className="text-warning" size={32} />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <Button onClick={() => router.push('/admin/products')} className="w-full">
                Manage Products
              </Button>
              <Button onClick={() => router.push('/admin/orders')} className="w-full">
                View Orders
              </Button>
              <Button onClick={() => router.push('/admin/customers')} className="w-full">
                Manage Customers
              </Button>
            </div>

            {/* Alerts */}
            {stats.lowStockProducts > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                <p className="font-semibold">⚠️ Low Stock Alert</p>
                <p className="text-sm">{stats.lowStockProducts} product(s) have low stock levels</p>
              </div>
            )}
          </>
        ) : null}
      </div>
      <Footer />
    </>
  );
}
