'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'react-icons/fa';
import { formatNaira, formatDateTime, getOrderStatusColor } from '@/lib/utils';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorMessage } from '@/components/DialogAndError';

interface OrderDetail {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  items: any[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
}

export default function OrderDetail({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session && params.id) {
      fetchOrder();
    }
  }, [session, params.id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      if (!res.ok) throw new Error('Failed to load order');
      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || !session) {
    return (
      <>
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-12">
          <LoadingSkeleton className="h-12 w-1/3 mb-8" />
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-12">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6">
            <ArrowLeft size={16} />
            Go Back
          </button>
          <ErrorMessage message="Failed to load order" details={error} />
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-12">
          <LoadingSkeleton className="h-12 w-1/3 mb-8" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm text-secondary-600 mb-6">
          <Link href="/customer/dashboard" className="hover:text-primary-600">Dashboard</Link>
          <ChevronRight size={16} />
          <span>Order {order?.orderNumber}</span>
        </div>

        {order && (
          <>
            {/* Order Summary */}
            <div className="bg-white rounded-lg border border-secondary-200 p-6 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-secondary-900 mb-2">Order {order.orderNumber}</h1>
                  <p className="text-secondary-600 text-sm">{formatDateTime(order.createdAt)}</p>
                </div>
                <span className={`text-sm font-semibold px-3 py-1.5 rounded ${getOrderStatusColor(order.status as any)}`}>
                  {order.status}
                </span>
              </div>

              {/* Order Items */}
              <div className="border-t border-secondary-200 pt-6">
                <h2 className="font-semibold text-secondary-900 mb-4">Items</h2>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-secondary-100 last:border-0">
                      <div>
                        <p className="font-medium text-secondary-900">{item.productName}</p>
                        <p className="text-sm text-secondary-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-secondary-900">{formatNaira(item.productPrice)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="bg-secondary-50 rounded-lg border border-secondary-200 p-6 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-secondary-700">
                  <span>Subtotal</span>
                  <span>{formatNaira(order.total)}</span>
                </div>
                <div className="border-t border-secondary-200 pt-3 flex justify-between items-center font-bold text-secondary-900 text-lg">
                  <span>Total</span>
                  <span className="text-primary-600">{formatNaira(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-lg border border-secondary-200 p-6">
              <h2 className="font-semibold text-secondary-900 mb-4">Delivery Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-secondary-600 mb-1">Name</p>
                  <p className="font-medium text-secondary-900">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-secondary-600 mb-1">Phone</p>
                  <p className="font-medium text-secondary-900">{order.customerPhone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-secondary-600 mb-1">Address</p>
                  <p className="font-medium text-secondary-900">{order.deliveryAddress}, {order.deliveryCity}, {order.deliveryState}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
