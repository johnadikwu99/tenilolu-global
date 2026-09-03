'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-secondary-900 text-secondary-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tenilolu Global Resources</h3>
            <p className="text-secondary-400 text-sm leading-relaxed">
              Natural products for everyday living. Home care and natural spices made with authentic Nigerian ingredients.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-secondary-400">
              <li>
                <Link href="/products?category=home-natural-care" className="hover:text-primary-400 transition-colors">
                  Home Care
                </Link>
              </li>
              <li>
                <Link href="/products?category=natural-food-spices" className="hover:text-primary-400 transition-colors">
                  Natural Spices
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary-400 transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-secondary-400">
              <li>
                <Link href="/about" className="hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-primary-400 transition-colors">
                  Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-secondary-400">
                <Phone size={16} />
                <span className="text-secondary-300">[Business Phone]</span>
              </li>
              <li className="flex items-center gap-2 text-secondary-400">
                <Mail size={16} />
                <span className="text-secondary-300">[Business Email]</span>
              </li>
              <li className="flex items-start gap-2 text-secondary-400">
                <MapPin size={16} className="mt-0.5" />
                <span className="text-secondary-300">[Business Location]</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-secondary-400 text-sm">
            <p>© 2024 Tenilolu Global Resources. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span>Natural. Authentic. Trusted.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
