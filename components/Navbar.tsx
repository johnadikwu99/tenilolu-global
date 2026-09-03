'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { ShoppingCart, Menu, X, LogOut, Settings } from 'react-icons/fa';
import { useCartStore } from '@/store/cart';
import { cn } from '@/lib/cn';
import { useState } from 'react';

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-secondary-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TGR</span>
            </div>
            <span className="hidden sm:inline font-semibold text-primary-700">Tenilolu</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-secondary-600 hover:text-primary-600 transition-colors text-sm font-medium">
              Shop
            </Link>
            <Link href="/about" className="text-secondary-600 hover:text-primary-600 transition-colors text-sm font-medium">
              About
            </Link>
            <Link href="/contact" className="text-secondary-600 hover:text-primary-600 transition-colors text-sm font-medium">
              Contact
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-secondary-600 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart size={20} />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>

            {/* Auth Menu */}
            {session ? (
              <div className="hidden sm:flex items-center gap-3">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-secondary-600 hover:text-primary-600 transition-colors"
                    title="Admin Dashboard"
                  >
                    <Settings size={20} />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-secondary-600 hover:text-error transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-secondary-600 hover:text-primary-600 transition-colors text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3 py-1.5 bg-primary-600 text-white rounded text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-secondary-600"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-secondary-200 py-4 space-y-3">
            <Link href="/products" className="block text-secondary-600 hover:text-primary-600 transition-colors py-2">
              Shop
            </Link>
            <Link href="/about" className="block text-secondary-600 hover:text-primary-600 transition-colors py-2">
              About
            </Link>
            <Link href="/contact" className="block text-secondary-600 hover:text-primary-600 transition-colors py-2">
              Contact
            </Link>
            {session ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-secondary-200">
                {isAdmin && (
                  <Link href="/admin" className="text-secondary-600 hover:text-primary-600 transition-colors py-2">
                    Admin Dashboard
                  </Link>
                )}
                <Link href="/customer/dashboard" className="text-secondary-600 hover:text-primary-600 transition-colors py-2">
                  My Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-secondary-600 hover:text-error transition-colors py-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t border-secondary-200">
                <Link href="/auth/login" className="text-secondary-600 hover:text-primary-600 transition-colors py-2">
                  Login
                </Link>
                <Link href="/auth/register" className="px-3 py-2 bg-primary-600 text-white rounded text-center font-medium hover:bg-primary-700 transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
