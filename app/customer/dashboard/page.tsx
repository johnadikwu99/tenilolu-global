'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ChevronRight, Package, Truck, Clock, MapPin } from 'react-icons/fa';
import { formatNaira, formatDateTime, getOrderStatusColor } from '@/lib/utils';
import { LoadingSkeleton, TableRowSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  items: any[];
}

export default function CustomerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchOrders();
      fetchProfile();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/customer/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/customer/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  if (status === 'loading' || !session) {
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
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-sm text-secondary-600 mb-2">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <ChevronRight size={16} />
            <span>Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">My Dashboard</h1>
          <p className="text-secondary-600">Welcome back, {session?.user?.name}</p>
        </div>

        {/* Profile Card */}
        {profile && (
          <div className="bg-white rounded-lg border border-secondary-200 p-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-secondary-900 mb-4">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-secondary-600 mb-1">Name</p>
                    <p className="font-medium text-secondary-900">{profile.user?.name}</p>
                  </div>
                  <div>
                    <p className="text-secondary-600 mb-1">Email</p>
                    <p className="font-medium text-secondary-900">{profile.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-secondary-600 mb-1">Phone</p>
                    <p className="font-medium text-secondary-900">{profile.customer?.deliveryPhone || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-secondary-600 mb-1">City</p>
                    <p className="font-medium text-secondary-900">{profile.customer?.deliveryCity || 'Not set'}</p>
                  </div>
                </div>
              </div>
              <Link href="/customer/profile" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Edit Profile
              </Link>
            </div>
          </div>
        )}

        {/* Orders */}
        <div>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Recent Orders</h2>

          {loading ? (
            <div className="bg-white rounded-lg border border-secondary-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary-50 border-b border-secondary-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-900 uppercase">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-900 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-900 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-900 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRowSkeleton key={i} columns={4} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              icon={<Package />}
              title="No orders yet"
              description="Start shopping to place your first order"
              action={{
                label: 'Continue Shopping',
                onClick: () => router.push('/products'),
              }}
            />
          ) : (
            <div className="bg-white rounded-lg border border-secondary-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary-50 border-b border-secondary-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-900 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-900 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-900 uppercase">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-900 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-900 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-900 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-secondary-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-primary-600">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-sm text-secondary-600">{formatDateTime(order.createdAt)}</td>
                      <td className="px-6 py-4 text-sm text-secondary-600">{order.items.length} item(s)</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded ${getOrderStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-secondary-900">{formatNaira(order.total)}</td>
                      <td className="px-6 py-4 text-sm">
                        <Link href={`/customer/orders/${order.id}`} className="text-primary-600 hover:text-primary-700 font-medium">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
